from flask import Flask, request, jsonify
import joblib
import pandas as pd
from imblearn.under_sampling import RandomUnderSampler
from scipy.sparse import vstack
from flask_cors import CORS
from sklearn.exceptions import InconsistentVersionWarning
import warnings

# Suppress specific warning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)


# Define the CustomUnderSampler class
class CustomUnderSampler:
    def __init__(self, random_state=42):
        self.random_state = random_state
    
    def fit_resample(self, X, y):
        # First, undersample the majority class
        rus = RandomUnderSampler(random_state=self.random_state)
        X_res, y_res = rus.fit_resample(X, y)
        
        # Ensure at least one sample per category
        combined = pd.DataFrame(X.todense(), columns=[f'col_{i}' for i in range(X.shape[1])])
        combined['is_fraud'] = y.values
        
        minority_samples = combined[combined['is_fraud'] == 1]
        
        for feature_idx in range(X.shape[1] - 1):  # Exclude the target
            unique_vals = minority_samples.iloc[:, feature_idx].unique()
            for val in unique_vals:
                if val not in X_res[:, feature_idx].toarray():
                    sample_idx = minority_samples[minority_samples.iloc[:, feature_idx] == val].index[0]
                    X_res = vstack([X_res, X[sample_idx]])
                    y_res = pd.concat([pd.Series(y_res), pd.Series(1)])
        
        return X_res, y_res

# Load the trained model
model = joblib.load("fraud_detection_model.pkl")

# Create a Flask app
app = Flask(__name__)
CORS(app ,resources={r"/*"} ,origins="*")  # Enable CORS

# Define the prediction route
@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.get_json()
    
    # Convert the JSON data to a DataFrame
    df = pd.DataFrame(data)
    
    # Make predictions
    probabilities = model.predict_proba(df)
    predictions = model.predict(df)
    
    # Return the result as JSON
    response = {
        'predictions': predictions.tolist(),
        'probabilities': probabilities.tolist()
    }
    
    return jsonify(response)

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
