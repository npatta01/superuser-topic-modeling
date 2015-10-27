import os
import sys
import nltk
from visualizations.lda_app import app


def runserver():
    nltk.data.path.append("nltk_data")

    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port,debug=True)


if __name__ == '__main__':
    runserver()
