from azure.communication.sms import SmsClient
from django.conf import settings


def send_whatsapp_message(to, message):
    #    Sends a WhatsApp message using Azure Communication Services.
    #     : param to: Recipient's WhatsApp number in E.164 format (e.g., +1234567890).
    #     :param message: Message text to send.

    connection_string = settings.AZURE_COMMUNICATION_SERVICES_CONNECTION_STRING
    sms_client = SmsClient.from_connection_string(connection_string)

    try:
        response = sms_client.send(
            from_='whatsapp:+14155238886',
            to=[f'whatsapp:{to}'],
            message=message,
        )

        for msg in response:
            print(f"Message ID: {msg.message_id}, Delivery status: {
                  msg.delivery_status}")
    except Exception as e:
        print(f"Error sending Whatsapp message: {str(e)}")
