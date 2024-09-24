from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'pageSize'
    page_query_param = 'current'

    def get_paginated_response(self, data):
        return Response({
            'meta': {
                'current': self.page.number,
                'pageSize': self.page.paginator.per_page,
                'total': self.page.paginator.count,
                'pages': self.page.paginator.num_pages,
            },
            'result': data
        })