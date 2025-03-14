import sys
import os

# Add virtual environment site-packages to path
VENV_PATH = os.path.expanduser("/home/u123456789/public_html/venv")
VENV_SITE_PACKAGES = os.path.join(VENV_PATH, "lib", "python3.9", "site-packages")
sys.path.insert(0, VENV_SITE_PACKAGES)

# Set Python interpreter
INTERP = os.path.join(VENV_PATH, "bin", "python3")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.append(os.getcwd())

from app import app as application 