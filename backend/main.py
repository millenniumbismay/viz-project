from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Set, Union
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class FilterStates(BaseModel):
    selectedFiltersArr: List[List[str]]
    filterNames: List[str]

class LineData(BaseModel):
    label: str
    data: List[Union[int, float]]
    fill: bool = False

class ChartData(BaseModel):
    labels: List[str]
    datasets: List[LineData]



'''
{
    labels: xData,
    datasets: Array.from({ length: yDataArr.length }, (_, i) => i).map(i => ({
      label: yLabelArr[i],
      data: yDataArr[i],
      fill: false
    }))
}
'''


@app.post("/api/lineplot", tags=["lineplot"])
async def lineplot(filterStates: FilterStates) -> ChartData:
    print(filterStates)
    df = pd.read_csv("data/gdp_2010_2020.csv")
    xArr = df.columns[1:].tolist()
    yArr = []
    for i in range(len(df)):
        yArr.append(df.iloc[i, 1:].astype(float).tolist())
    yLabelArr = df.iloc[:, 0].tolist()
    return ChartData(labels=xArr, datasets=[LineData(label=yLabelArr[i], data=yArr[i]) for i in range(len(yArr))])

