from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings

def send_otp_email(email, link_verify):
    subject = 'Lấy lại mật khẩu'
    context = {
        'link_verify': link_verify,
    }
    message = render_to_string('otp.template.html', context)
    email_message = EmailMessage(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
    )
    email_message.content_subtype = 'html'  # Đặt loại nội dung là HTML
    email_message.send(fail_silently=False)
def send_new_password(email,password):
    subject = 'Mật khẩu mới'
    context = {
        'password': password,
    }
    message = render_to_string('new-password.template.html', context)
    email_message = EmailMessage(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
    )
    email_message.content_subtype = 'html'  # Đặt loại nội dung là HTML
    email_message.send(fail_silently=False)

def send_otp_email_thread(email, link_verify):
    send_otp_email(email, link_verify)

def send_new_password_thread(email,password):
    send_new_password(email,password)