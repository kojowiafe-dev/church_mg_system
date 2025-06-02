import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core import config
import logging

logger = logging.getLogger(__name__)

def send_email(subject: str, body: str, to: list[str]):
    """
    Send an email using SMTP.
    
    Args:
        subject (str): Email subject
        body (str): Email body (can be HTML)
        to (list[str]): List of recipient email addresses
    """
    try:
        # Check if SMTP credentials are configured
        if not config.settings.SMTP_USERNAME or not config.settings.SMTP_PASSWORD:
            logger.error("SMTP credentials not configured")
            raise ValueError("Email service not configured")

        msg = MIMEMultipart()
        msg['From'] = config.settings.SMTP_USERNAME
        msg['To'] = ', '.join(to)
        msg['Subject'] = subject

        # Attach body
        msg.attach(MIMEText(body, 'html'))

        logger.info(f"Attempting to send email to {to} using {config.settings.SMTP_HOST}:{config.settings.SMTP_PORT}")

        # Connect to SMTP server and send email
        with smtplib.SMTP(config.settings.SMTP_HOST, config.settings.SMTP_PORT) as server:
            server.starttls()
            server.login(config.settings.SMTP_USERNAME, config.settings.SMTP_PASSWORD)
            server.send_message(msg)
            
        logger.info(f"Email sent successfully to {to}")
        
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed")
        raise ValueError("Email service authentication failed")
    except smtplib.SMTPException as e:
        logger.error(f"SMTP error: {str(e)}")
        raise ValueError(f"Failed to send email: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        raise ValueError(f"Failed to send email: {str(e)}")
