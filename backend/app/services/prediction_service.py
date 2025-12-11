"""
Statistical Prediction Service
Generates forecasts using Exponential Smoothing and ARIMA models
"""
import numpy as np
import pandas as pd
from typing import List, Dict
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from statsmodels.tsa.arima.model import ARIMA
from sklearn.linear_model import LinearRegression


def score_to_phase(score: float) -> str:
    """Map numeric score to phase label"""
    if score >= 8:
        return "Very High"
    elif score >= 4:
        return "High"
    elif score >= 0:
        return "Moderate"
    elif score >= -3:
        return "Low"
    else:
        return "Very Low"


def generate_statistical_forecast(events, forecast_years: int = 5) -> List[Dict]:
    """
    Generate statistical forecast using multiple methods and averaging results.
    
    Args:
        events: List of LifeEvent objects
        forecast_years: Number of years to forecast (default: 5)
    
    Returns:
        List of forecast points with year, score, and phase
    """
    # Extract scores and years
    scores = [event.score for event in events]
    years = [event.year + (event.month or 6) / 12.0 for event in events]  # Convert to decimal year
    
    if len(scores) < 3:
        # Not enough data for statistical forecast, return simple linear trend
        return simple_linear_forecast(events, forecast_years)
    
    # Create time series
    df = pd.DataFrame({'year': years, 'score': scores})
    df = df.sort_values('year')
    
    # Get last year and generate future years
    last_year = int(max(years))
    future_years = [last_year + i for i in range(1, forecast_years + 1)]
    
    forecasts = []
    
    try:
        # Method 1: Exponential Smoothing
        if len(scores) >= 4:
            model_es = ExponentialSmoothing(
                df['score'].values,
                seasonal_periods=None,
                trend='add',
                seasonal=None
            )
            fitted_es = model_es.fit()
            forecast_es = fitted_es.forecast(steps=forecast_years)
            forecasts.append(forecast_es)
    except Exception as e:
        print(f"Exponential Smoothing failed: {e}")
    
    try:
        # Method 2: ARIMA
        model_arima = ARIMA(df['score'].values, order=(1, 0, 1))
        fitted_arima = model_arima.fit()
        forecast_arima = fitted_arima.forecast(steps=forecast_years)
        forecasts.append(forecast_arima)
    except Exception as e:
        print(f"ARIMA failed: {e}")
    
    try:
        # Method 3: Linear Regression
        X = np.array(df['year'].values).reshape(-1, 1)
        y = df['score'].values
        model_lr = LinearRegression()
        model_lr.fit(X, y)
        future_X = np.array(future_years).reshape(-1, 1)
        forecast_lr = model_lr.predict(future_X)
        forecasts.append(forecast_lr)
    except Exception as e:
        print(f"Linear Regression failed: {e}")
    
    # Average all successful forecasts
    if forecasts:
        avg_forecast = np.mean(forecasts, axis=0)
    else:
        # Fallback to simple mean
        avg_forecast = [np.mean(scores)] * forecast_years
    
    # Clip scores to valid range [-10, 10]
    avg_forecast = np.clip(avg_forecast, -10, 10)
    
    # Build forecast result
    result = []
    for year, score in zip(future_years, avg_forecast):
        result.append({
            "year": int(year),
            "score": round(float(score), 2),
            "phase": score_to_phase(float(score))
        })
    
    return result


def simple_linear_forecast(events, forecast_years: int = 5) -> List[Dict]:
    """
    Simple linear trend forecast for cases with insufficient data.
    """
    scores = [event.score for event in events]
    years = [event.year for event in events]
    
    if len(scores) < 2:
        # Just use the last score
        last_score = scores[-1] if scores else 0
        last_year = years[-1] if years else 2024
        return [
            {
                "year": last_year + i,
                "score": round(last_score, 2),
                "phase": score_to_phase(last_score)
            }
            for i in range(1, forecast_years + 1)
        ]
    
    # Calculate simple linear trend
    X = np.array(years).reshape(-1, 1)
    y = np.array(scores)
    model = LinearRegression()
    model.fit(X, y)
    
    last_year = max(years)
    future_years = [last_year + i for i in range(1, forecast_years + 1)]
    future_X = np.array(future_years).reshape(-1, 1)
    forecast = model.predict(future_X)
    forecast = np.clip(forecast, -10, 10)
    
    result = []
    for year, score in zip(future_years, forecast):
        result.append({
            "year": int(year),
            "score": round(float(score), 2),
            "phase": score_to_phase(float(score))
        })
    
    return result

