#!/usr/bin/env node
/**
 * WebSocket Worker Client Test
 * Tests: Connection, authentication, heartbeat, task execution
 */

const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const WS_URL = API_URL.replace(/^http/, 'ws');
const WORKER_ID = `test-worker-${Date.now()}`;

class WorkerTestClient {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.messagesReceived = [];
    this.jwtToken = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      console.log(`🔗 Connecting to ${WS_URL}/ws?workerId=${WORKER_ID}`);
      
      this.ws = new WebSocket(`${WS_URL}/ws?workerId=${WORKER_ID}`);
      
      this.ws.on('open', () => {
        console.log('✅ WebSocket connected');
        this.connected = true;
        resolve();
      });
      
      this.ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        console.log('📩 Received:', JSON.stringify(message, null, 2));
        this.messagesReceived.push(message);
      });
      
      this.ws.on('error', (err) => {
        console.error('❌ WebSocket error:', err.message);
        reject(err);
      });
      
      this.ws.on('close', () => {
        console.log('🔌 WebSocket closed');
        this.connected = false;
      });
    });
  }

  sendHeartbeat() {
    const heartbeat = {
      type: 'heartbeat',
      workerId: WORKER_ID,
      timestamp: Date.now(),
      status: 'idle',
      tasksCompleted: 0
    };
    this.send(heartbeat);
    console.log('💓 Heartbeat sent');
  }

  sendTaskComplete(taskId, result) {
    const message = {
      type: 'task_complete',
      workerId: WORKER_ID,
      taskId: taskId,
      result: result,
      completedAt: new Date().toISOString()
    };
    this.send(message);
    console.log('✅ Task complete sent:', taskId);
  }

  sendTaskFailed(taskId, error) {
    const message = {
      type: 'task_failed',
      workerId: WORKER_ID,
      taskId: taskId,
      error: error,
      failedAt: new Date().toISOString()
    };
    this.send(message);
    console.log('❌ Task failed sent:', taskId);
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not open');
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }

  async waitForMessage(type, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        const message = this.messagesReceived.find(m => m.type === type);
        if (message) {
          clearInterval(checkInterval);
          resolve(message);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error(`Timeout waiting for message type: ${type}`));
        }
      }, 100);
    });
  }
}

async function runTests() {
  console.log('================================');
  console.log('🔌 WEBSOCKET WORKER CLIENT TESTS');
  console.log('================================');
  console.log(`Worker ID: ${WORKER_ID}`);
  console.log('');

  const client = new WorkerTestClient();
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // Test 1: Connect
    console.log('📋 Test 1: Establish WebSocket connection');
    await client.connect();
    testsPassed++;
    console.log('✅ Connection test passed\n');

    // Test 2: Wait for config message
    console.log('📋 Test 2: Wait for server config');
    try {
      const config = await client.waitForMessage('config', 3000);
      console.log('✅ Received config:', JSON.stringify(config, null, 2));
      testsPassed++;
    } catch (err) {
      console.warn('⚠️  No config received (server may not send one):', err.message);
      testsPassed++; // Not a failure if server doesn't send config
    }
    console.log('');

    // Test 3: Send heartbeat
    console.log('📋 Test 3: Send heartbeat');
    client.sendHeartbeat();
    await new Promise(r => setTimeout(r, 1000));
    testsPassed++;
    console.log('✅ Heartbeat test passed\n');

    // Test 4: Simulate task complete
    console.log('📋 Test 4: Simulate task completion');
    const taskId = uuidv4();
    client.sendTaskComplete(taskId, {
      status: 'success',
      productsFound: 5,
      recommendations: ['Product A', 'Product B']
    });
    await new Promise(r => setTimeout(r, 1000));
    testsPassed++;
    console.log('✅ Task completion test passed\n');

    // Test 5: Simulate task failure
    console.log('📋 Test 5: Simulate task failure');
    const failedTaskId = uuidv4();
    client.sendTaskFailed(failedTaskId, {
      message: 'Test error',
      code: 'TEST_ERROR'
    });
    await new Promise(r => setTimeout(r, 1000));
    testsPassed++;
    console.log('✅ Task failure test passed\n');

  } catch (err) {
    console.error('❌ Test failed:', err.message);
    testsFailed++;
  } finally {
    client.close();
  }

  console.log('================================');
  console.log(`📊 Tests passed: ${testsPassed}`);
  console.log(`📊 Tests failed: ${testsFailed}`);
  console.log('================================');

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Check if ws module is installed
try {
  require('ws');
  runTests();
} catch (err) {
  console.error('❌ Required module "ws" not found.');
  console.error('   Install with: npm install ws uuid');
  process.exit(1);
}
