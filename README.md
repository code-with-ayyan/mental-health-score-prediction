# 🧠 Mental Health Score Prediction

An end-to-end machine learning regression project that predicts a person's **mental health score** from their social media usage, lifestyle habits, academic level, and demographic details. The trained model is served through a **FastAPI** backend and consumed by a modern **React (Vite)** dashboard, **PredictHub**.

🔗 **Live Demo:** [predicthub-mental-health.duckdns.org](https://predicthub-mental-health.duckdns.org/)

---

## ✨ Features

- Regression model trained and packaged as a single scikit-learn pipeline (`pipeline.pkl`), so preprocessing and prediction always stay in sync
- FastAPI REST API with strict input validation (Pydantic)
- Premium dark-themed React dashboard with charts
- Client-side validation: if daily hours (social media + study + physical activity + sleep) add up to more than 24, the user sees an error and no request is sent
- CORS enabled for easy frontend integration
- Deployed live with a custom DuckDNS domain

---

## 🧱 Tech Stack

| Layer | Tools |
| --- | --- |
| Machine Learning | Python, Pandas, NumPy, Scikit-learn, Jupyter Notebook |
| Backend | FastAPI, Pydantic, Uvicorn, Joblib |
| Frontend | React, Vite, Tailwind CSS, Lucide Icons, Recharts |
| Deployment | AWS (EC2), ubunut, DuckDNS (live domain) |

---

## 📁 Project Structure

```
mental-health-score-prediction/
├── frontend/          
├── app.py             
├── main.ipynb          
├── data.csv             
├── pipeline.pkl         
├── requirements.txt     
└── README.md
```

---

## 🤖 Model

- **Task:** Regression (predicts a continuous mental health score)
- **Approach:** Preprocessing (encoding and scaling) and the regressor are combined in one scikit-learn `Pipeline`, saved with Joblib and loaded once at API startup
- **Full workflow:** EDA, preprocessing, training, and evaluation are in [`main.ipynb`](main.ipynb)

### Input Features

| Feature | Type | Allowed Values / Range |
| --- | --- | --- |
| `age` | int | 10 – 100 |
| `gender` | str | `Male`, `Female` |
| `grouped_country` | str | India, USA, Canada, Australia, UK, Germany, Turkey, Mexico, France, Spain, Ireland, Japan, Denmark, Switzerland, Other |
| `academic_level` | str | `High School`, `Undergraduate`, `Graduate` |
| `most_used_platform` | str | Facebook, LinkedIn, Instagram, Snapchat, Twitter, YouTube, TikTok, LINE, KakaoTalk, VKontakte, WhatsApp, WeChat |
| `purpose_of_use` | str | `Networking`, `Education`, `Entertainment`, `News` |
| `avg_daily_usage_hours` | float | 0 – 24 |
| `daily_unlocks` | int | ≥ 0 |
| `study_hours` | float | 0 – 24 |
| `physical_activity_hours` | float | 0 – 24 |
| `sleep_hours_per_night` | float | 0 – 24 |
| `stress_level` | str | `Low`, `Medium`, `High`, `Very High` |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/code-with-ayyan/mental-health-score-prediction.git
cd mental-health-score-prediction
```

### 2. Run the backend

```bash
# (optional) create a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# start the API
uvicorn app:app --reload
```

The API runs at `http://127.0.0.1:8000`, with interactive docs at `http://127.0.0.1:8000/docs`.

> ⚠️ `pipeline.pkl` was trained with a specific scikit-learn version. Use the version pinned in `requirements.txt` to avoid loading errors.

### 3. Run the frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Then start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 📡 API Reference

### `GET /`

Health check.

### `POST /predict`

Returns the predicted mental health score.

**Request body**

```json
{
  "age": 21,
  "gender": "Female",
  "grouped_country": "India",
  "academic_level": "Undergraduate",
  "most_used_platform": "Instagram",
  "purpose_of_use": "Entertainment",
  "avg_daily_usage_hours": 5.5,
  "daily_unlocks": 80,
  "study_hours": 3,
  "physical_activity_hours": 1,
  "sleep_hours_per_night": 6.5,
  "stress_level": "High"
}
```

**Response**

```json
{
  "prediction": 6.42
}
```

(The value above is only an example of the response format.)

**cURL example**

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"age":21,"gender":"Female","grouped_country":"India","academic_level":"Undergraduate","most_used_platform":"Instagram","purpose_of_use":"Entertainment","avg_daily_usage_hours":5.5,"daily_unlocks":80,"study_hours":3,"physical_activity_hours":1,"sleep_hours_per_night":6.5,"stress_level":"High"}'
```

Invalid inputs (wrong category, out-of-range numbers) return a `422 Unprocessable Entity` response with details.

---

## ⚠️ Disclaimer

This project is for **educational and portfolio purposes only**. It is not a medical or diagnostic tool and should not be used as a substitute for professional mental health advice.

---

## 👤 Author

**Ayyan**
GitHub: [@code-with-ayyan](https://github.com/code-with-ayyan)

---

⭐ If you found this project useful, consider giving it a star!
