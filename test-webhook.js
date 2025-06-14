const fetch = require('node:fetch');

async function testWebhook() {
  const webhookUrl = 'https://6f873bc8-c1e2-4ab8-8785-32311908b675-00-26mpztqha7eke.worf.replit.dev/telegram/webhook';
  
  const testUpdate = {
    update_id: 123456789,
    message: {
      message_id: 1,
      from: {
        id: 123456789,
        is_bot: false,
        first_name: "Test",
        username: "testuser"
      },
      chat: {
        id: 123456789,
        first_name: "Test",
        username: "testuser",
        type: "private"
      },
      date: 1640995200,
      text: "/status"
    }
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUpdate)
    });

    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response body:', result);
  } catch (error) {
    console.error('Error testing webhook:', error);
  }
}

testWebhook();