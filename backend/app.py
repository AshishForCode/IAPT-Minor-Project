from flask import Flask
from flask_cors import CORS
from config import Config

# Import blueprints
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.timetable import timetable_bp
from routes.studyplan import studyplan_bp
from routes.placement import placement_bp
from routes.mocktests import mocktests_bp
from routes.resources import resources_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app) # Enable CORS for all routes

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(timetable_bp, url_prefix='/api/timetable')
    app.register_blueprint(studyplan_bp, url_prefix='/api/studyplan')
    app.register_blueprint(placement_bp, url_prefix='/api/placement')
    app.register_blueprint(mocktests_bp, url_prefix='/api/mocktests')
    app.register_blueprint(resources_bp, url_prefix='/api/resources')

    @app.route('/')
    def index():
        return "Welcome to IAPT Backend API"

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
