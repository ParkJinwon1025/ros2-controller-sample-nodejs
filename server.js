#!/usr/bin/env node

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const rclnodejs = require('rclnodejs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 8080;
const HOST = '0.0.0.0';  // Listen on all network interfaces
let node = null;
let actionClient = null;

// Static files
app.use(express.static(__dirname));

// Main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web_client_rclnodejs.html'));
});

// Initialize ROS2
async function initROS2() {
  try {
    console.log('Initializing ROS2...');

    await rclnodejs.init();
    node = new rclnodejs.Node('web_server_node');

    console.log('✅ ROS2 Node created: web_server_node');

    // Create publishers and subscribers
    setupTopics();
    setupServices();
    setupActions();

    // Start spinning
    rclnodejs.spin(node);

  } catch (error) {
    console.error('❌ Failed to initialize ROS2:', error);
  }
}

// Setup Topics
function setupTopics() {
  // Publisher
  const positionPublisher = node.createPublisher(
    'test_interfaces/msg/Position',
    '/position_topic'
  );

  // Subscriber
  const positionSubscriber = node.createSubscription(
    'test_interfaces/msg/Position',
    '/position_topic',
    (msg) => {
      io.emit('topic_received', msg);
    }
  );

  // Socket.io: Publish topic
  io.on('connection', (socket) => {
    socket.on('publish_position', (data) => {
      try {
        console.log('📍 Topic publish request:', data);

        const msg = {
          sender: 'Web',
          x: Number(data.x),
          y: Number(data.y),
          z: Number(data.z),
          angle: Number(data.angle),
          timestamp: Date.now() * 1000000  // Convert to nanoseconds as integer
        };

        console.log('📤 Publishing topic:', msg);
        positionPublisher.publish(msg);

        // Send back to client (convert timestamp for JSON)
        socket.emit('topic_sent', {
          ...msg,
          timestamp: msg.timestamp.toString()
        });
        console.log('✅ Topic published successfully');

      } catch (error) {
        console.error('❌ Topic publish failed:', error);
        console.error('Error stack:', error.stack);
        socket.emit('topic_error', error.message);
      }
    });
  });

  console.log('✅ Topic Publisher/Subscriber ready');
}

// Setup Services
function setupServices() {
  const CalculateDistance = require('./node_modules/rclnodejs/generated/test_interfaces/test_interfaces__srv__CalculateDistance.js');

  const serviceClient = node.createClient(
    'test_interfaces/srv/CalculateDistance',
    '/calculate_distance'
  );

  io.on('connection', (socket) => {
    socket.on('call_service', async (data) => {
      try {
        console.log('📞 Service request received:', data);

        // Create proper request object using generated class
        // Pass object to constructor - it will be auto-frozen
        const requestData = {
          x1: Number(data.x1),
          y1: Number(data.y1),
          z1: Number(data.z1),
          x2: Number(data.x2),
          y2: Number(data.y2),
          z2: Number(data.z2)
        };

        const request = new CalculateDistance.Request(requestData);

        console.log('📤 Sending service request:', requestData);

        if (!serviceClient.waitForService(1000)) {
          const errorMsg = 'Service not available';
          console.error('❌ Service error:', errorMsg);
          socket.emit('service_error', errorMsg);
          return;
        }

        // sendRequest requires a callback, wrap in Promise
        const response = await new Promise((resolve, reject) => {
          try {
            serviceClient.sendRequest(request, (response) => {
              if (response) {
                resolve(response);
              } else {
                reject(new Error('No response received'));
              }
            });
          } catch (err) {
            reject(err);
          }
        });

        console.log('✅ Service response:', response);

        // Response is already a plain object
        socket.emit('service_response', response);

      } catch (error) {
        console.error('❌ Service call failed:', error);
        console.error('Error stack:', error.stack);
        socket.emit('service_error', error.message);
      }
    });
  });

  console.log('✅ Service Client ready');
}

// Setup Actions
function setupActions() {
  actionClient = new rclnodejs.ActionClient(
    node,
    'test_interfaces/action/MoveTo',
    '/move_to_action'
  );

  io.on('connection', (socket) => {
    socket.on('send_action_goal', async (data) => {
      try {
        console.log('🎯 Action goal request received:', data);

        const goal = {
          target_x: Number(data.target_x),
          target_y: Number(data.target_y),
          target_z: Number(data.target_z),
          target_angle: Number(data.target_angle)
        };

        console.log('📤 Sending action goal:', goal);
        socket.emit('action_status', 'Sending goal...');

        // Send goal with feedback callback
        const goalHandle = await actionClient.sendGoal(
          goal,
          (feedback) => {
            // Feedback callback
            console.log('📊 Feedback received:', feedback);
            socket.emit('action_feedback', feedback);
          }
        );

        if (!goalHandle.accepted) {
          const errorMsg = 'Goal rejected';
          console.error('❌ Action goal rejected');
          socket.emit('action_error', errorMsg);
          return;
        }

        socket.emit('action_status', 'Goal accepted!');
        console.log('✅ Goal accepted, waiting for result...');

        // Wait for result
        const result = await goalHandle.getResult();
        console.log('✅ Action result received:', result);
        socket.emit('action_result', result);

      } catch (error) {
        console.error('❌ Action goal failed:', error);
        console.error('Error stack:', error.stack);
        socket.emit('action_error', error.message);
      }
    });

    socket.on('cancel_action_goal', async () => {
      try {
        // Cancel is handled automatically when client disconnects
        // or you can implement custom cancellation logic
        socket.emit('action_status', 'Cancel requested');
      } catch (error) {
        socket.emit('action_error', error.message);
      }
    });
  });

  console.log('✅ Action Client ready');
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  socket.emit('ros_status', 'connected');

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 External access: http://192.168.189.132:${PORT}`);
  console.log(`📡 Waiting for ROS2 initialization...\n`);
  initROS2();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  if (node) {
    node.destroy();
  }
  rclnodejs.shutdown();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
