
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import numpy as np

# Define the quiz data
tempQuestions = [{
        'numb': 1,
        'question': "What is an exoplanet?",
        'answer': "C. A planet outside our solar system orbiting a star other than the Sun.",
        'options': [
            "A. A planet with rings like Saturn.",
            "B. A dwarf planet within our solar system.",
            "C. A planet outside our solar system orbiting a star other than the Sun.",
            "D. A planet found within the asteroid belt."
        ]
    },
    {
        'numb': 2,
        'question': "Which planet in our solar system is known as the 'Red Planet'?",
        'answer': "B. Mars",
        'options': [
            "A. Venus",
            "B. Mars",
            "C. Jupiter",
            "D. Saturn"
        ]
    },
    {
        'numb': 3,
        'question': "What does the term 'habitable zone' refer to?",
        'answer': "A. The area around a star where conditions may be right for life.",
        'options': [
            "A. The area around a star where conditions may be right for life.",
            "B. The area inside a planet's core.",
            "C. The region of space with no planets.",
            "D. The zone of a black hole."
        ]
    },
    {
        'numb': 4,
        'question': "What is the name of NASA's space telescope that has discovered many exoplanets?",
        'answer': "C. Kepler Space Telescope",
        'options': [
            "A. Hubble Space Telescope",
            "B. James Webb Space Telescope",
            "C. Kepler Space Telescope",
            "D. Spitzer Space Telescope"
        ]
    },
    {
        'numb': 5,
        'question': "What role does the transit method play in exoplanet discovery?",
        'answer': "B. Observes dips in starlight caused by planets passing in front of stars",
        'options': [
            "A. Measures light reflection from planets",
            "B. Observes dips in starlight caused by planets passing in front of stars",
            "C. Detects sound waves from planets",
            "D. Analyzes radiation from stars"
        ]
    },
    {
        'numb': 6,
        'question': "What is a 'super-Earth'?",
        'answer': "B. A planet larger than Earth but smaller than Neptune",
        'options': [
            "A. An Earth-like planet with multiple moons",
            "B. A planet larger than Earth but smaller than Neptune",
            "C. An Earth-sized planet with no atmosphere",
            "D. An Earth-sized planet with rings"
        ]
    },
    {
        'numb': 7,
        'question': "How can studying an exoplanet's atmosphere provide clues about its composition?",
        'answer': "B. Through spectroscopy, which measures light absorption by gases",
        'options': [
            "A. By analyzing its color and brightness",
            "B. Through spectroscopy, which measures light absorption by gases",
            "C. By measuring its temperature fluctuations",
            "D. By observing its gravitational pull on nearby objects"
        ]
    },
    {
        'numb': 8,
        'question': "How the Doppler effect helps in studying exoplanets?",
        'answer': "A. It measures changes in light frequency due to star movement.",
        'options': [
            "A. It measures changes in light frequency due to star movement.",
            "B. It detects sound waves from planets.",
            "C. It analyzes radiation patterns from stars.",
            "D. It measures temperature variations in space."
        ]
    },
    {
        'numb': 9,
        'question': "What are the challenges in characterizing exoplanet atmospheres?",
        'answer': "D. All of the above.",
        'options': [
            "A. Limited technology for observation.",
            "B. The vast distances involved.",
            "C. Interference from starlight.",
            "D. All of the above."
        ]
    },
    {
        'numb': 10,
        'question': "What role do computer simulations play in predicting the characteristics of unobserved exoplanets?",
        'answer': "A. They visualize potential planetary systems based on known data.",
        'options': [
            "A. They visualize potential planetary systems based on known data.",
            "B. They replace actual observations entirely.",
            "C. They have no real-world applications.",
            "D. They only simulate black holes."
        ]
    }
]

# Load dataset
# The dataset should have columns: 'user_id', 'quiz_id', 'rating'
df = pd.read_csv(r'C:\Users\hp\DS\Downloads\Astro-Trivia-main\Astro-Trivia-main\exoplanet_learning_data.csv.csv')


# Preview the data
print("Data Preview:")
print(df.head())

# Define the Reader for the Surprise library
reader = Reader(rating_scale=(1, 5))

# Create the Surprise dataset
data = Dataset.load_from_df(df[['user_id', 'quiz_id', 'rating']], reader)

# Split the dataset into training and testing sets
trainset, testset = train_test_split(data, test_size=0.2)

# Initialize the SVD (Singular Value Decomposition) model
model = SVD()

# Train the model on the training set
model.fit(trainset)

# Test the model's accuracy on the test set
predictions = model.test(testset)
rmse = accuracy.rmse(predictions)

print(f"RMSE of the SVD model: {rmse}")

# Recommend top N quizzes for a specific user
def get_top_n(predictions, n=5):
    top_n = {}
    for uid, iid, true_r, est, _ in predictions:
        if uid not in top_n:
            top_n[uid] = []
        # Calculate percentage
        percentage = ((est - 1) / 4) * 100
        top_n[uid].append((iid, est, percentage))

    # Sort the predictions for each user and retrieve the highest-rated quizzes
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]

    return top_n

# Now when you get recommendations, it will include the percentage
top_n_recommendations = get_top_n(predictions, n=5)

# Map the quiz IDs to the question details from tempQuestions
quiz_map = {q['numb']: q for q in tempQuestions}

# Display the recommendations with quiz details and percentages
for user, recommendations in top_n_recommendations.items():
    print(f"Top quiz recommendations for user {user}:")
    for quiz_id, est_rating, percentage in recommendations:
        if quiz_id in quiz_map:
            quiz = quiz_map[quiz_id]
            print(f" - Quiz ID: {quiz_id}, Question: {quiz['question']}")
            print(f"   Predicted Rating: {est_rating:.2f}, Percentage: {percentage:.2f}%")
            print(f"   Options: {', '.join(quiz['options'])}")
        else:
            print(f" - Quiz ID: {quiz_id} (details not found), Predicted Rating: {est_rating:.2f}, Percentage: {percentage:.2f}%")
