
   
import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'api.settings')

django.setup()


from channels.routing import ProtocolTypeRouter, URLRouter

from channels.security.websocket import AllowedHostsOriginValidator, OriginValidator
import classifier.routing as ClassifierRouting



routes = ClassifierRouting.websocket_urlpatterns



application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(routes)
})