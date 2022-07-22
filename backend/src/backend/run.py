from quart import Quart

from backend.blueprints.control import blueprint as control_blueprint

app = Quart(__name__)
app.config.from_prefixed_env(prefix="TOZO")

app.register_blueprint(control_blueprint)
