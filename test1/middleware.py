# myproject/middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from rest_framework.response import Response

class CustomResponseMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if isinstance(response, JsonResponse):
            try:
                data = response.json()
            except AttributeError:
                data = None
        if isinstance(response, JsonResponse):
            data = response.json()
            if response.status_code >= 400:
                print(data)
                formatted_response = {
                    'statusCode': response.status_code,
                    'message': 'error',
                    'error': data
                }
                return JsonResponse(formatted_response, status=response.status_code)
            else:
                formatted_response = {
                    'statusCode': response.status_code,
                    'data': data
                }
                return JsonResponse(formatted_response, status=response.status_code)
        elif isinstance(response, Response):
            data = response.data
            if response.status_code >= 400:
                formatted_response = {
                    'statusCode': response.status_code,
                    'message': 'error',
                    'error': data
                }
                response.data = formatted_response
                response.content = response.rendered_content
            else:
                formatted_response = {
                    'statusCode': response.status_code,
                    'data': data
                }
                response.data = formatted_response
                response.content = response.rendered_content
        return response