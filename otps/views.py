# views.py

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import OtpSerializer
import redis
import uuid
from datetime import timedelta
from users.models import User
from mails.views import send_otp_email_thread,send_new_password_thread
import threading
import json

# Kết nối tới Redis
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

class OtpCreateView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            curr_user = User.objects.get(email=request.data.get('email'))
        except :
            return Response('User not found', status=status.HTTP_400_BAD_REQUEST)
        
        exist_usr = redis_client.get(request.data.get('email'))
        if exist_usr:
            return Response('User already requested OTP', status=status.HTTP_400_BAD_REQUEST)

        serializer = OtpSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = str(uuid.uuid4())
            data  = {
                'email': email,
                'token': otp
            }
            data_json = json.dumps(data)
            # Lưu OTP vào Redis với TTL là 10 phút
            redis_client.setex(otp, timedelta(minutes=10), data_json)
            # Gửi OTP qua email trong một luồng riêng
            link_verify = f'http://localhost:8888/api/v1/users/password/forgot-password?token={otp}'
            email_thread = threading.Thread(target=send_otp_email_thread, args=(email, link_verify))
            email_thread.start()
            return Response({'email': email}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def verify_otp(token):
    data = redis_client.get(token)
    if not data:
        return False

    data = json.loads(data)

    if data['token'] != token:
        return False
    
    try:
        usr = User.objects.get(email=data['email'])
    except:
        return False
    #generate hash password
    new_password = str(uuid.uuid4())
    usr.set_password(new_password)
    usr.save()

    # Xóa OTP khỏi Redis
    redis_client.delete(token)

    # Gửi mật khẩu mới qua email trong một luồng riêng
    email_thread = threading.Thread(target=send_new_password_thread, args=(data['email'], new_password))
    email_thread.start()
    return True