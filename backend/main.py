from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Union, Any
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

origins = [
    "http://localhost:3002",
    "localhost:3002"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

'''
Statistics:
--------------------------------
H-1B               5038050
H-2A                105401
E-3 Australian       83874
H-2B                 36137
H-1B1 Singapore       8009
H-1B1 Chile           6430
--------------------------------=
Professional and business services                                   4265613
Educational services, health care, and social assistance              353937
Finance, insurance, real estate, rental, and leasing                  237660
Others                                                                185207
Agriculture, forestry, fishing, and hunting                           107226
Arts, entertainment, recreation, accommodation, and food services      67984
Information                                                            26184
Utilities                                                              18410
Manufacturing                                                           3810
Government                                                              3534
Construction                                                            3235
Transportation and Warehousing                                          2222
Wholesale and Retail Trade                                              2129
Real estate and rental and leasing                                       606
Mining                                                                   144
-------------------------------

'''

class FilterStates(BaseModel):
    selectedFiltersArr: List[List[str]]
    filterNames: List[str]

class LineData(BaseModel):
    label: str
    data: List[Union[int, float]]
    fill: bool = False

class LineChartData(BaseModel):
    labels: List[str]
    datasets: List[LineData]

class StackedBarQuery(BaseModel):
    year: int
    selectedCountries: List[str]
    selectedVisas: List[str]

class StackedBarData(BaseModel):
    labels: List[str]
    datasets: List[Dict[Any, Any]]



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

gdp_data = pd.read_csv("data/gdp_2010_2020.csv")

@app.post("/api/lineplot", tags=["lineplot"])
async def lineplot(filterStates: FilterStates) -> LineChartData:
    print("filterStates:", filterStates)

    selectedSectors = ['All Sector'] ### By default it will be All Sector
    if len(filterStates.selectedFiltersArr[2]) > 0:
        selectedSectors = filterStates.selectedFiltersArr[2]

    temp_gdp_df = gdp_data[gdp_data['Sector'].isin(selectedSectors)]
    print(temp_gdp_df)
    xArr = temp_gdp_df.columns[1:].tolist()
    yArr = []
    for i in range(len(temp_gdp_df)):
        yArr.append(temp_gdp_df.iloc[i, 1:].astype(float).tolist())
    yLabelArr = temp_gdp_df.iloc[:, 0].tolist()
    return LineChartData(labels=xArr, datasets=[LineData(label=yLabelArr[i], data=yArr[i]) for i in range(len(yArr))])



@app.post("/api/stackedbar", tags=["stackedbar"])
async def stackedbar(query: StackedBarQuery) -> StackedBarData:
    print(query.year, query.selectedCountries, query.selectedVisas)
    return StackedBarData(
        labels=["2015", "2014", "2013", "2012", "2011"],
        datasets=[
            {
                "data": [727, 589, 537, 543, 574],
                "backgroundColor": "rgba(63,103,126,1)",
                "hoverBackgroundColor": "rgba(50,90,100,1)"
            },
            {
                "data": [238, 380, 426, 453, 502],
                "backgroundColor": "rgba(163,103,126,1)",
                "hoverBackgroundColor": "rgba(140,85,100,1)"
            },
            {
                "data": [123, 387, 543, 234, 112],
                "backgroundColor": "rgba(63,203,126,1)",
                "hoverBackgroundColor": "rgba(50,180,100,1)"
            },
            {
                "data": [423, 189, 287, 153, 12],
                "backgroundColor": "rgba(163,203,126,1)",
                "hoverBackgroundColor": "rgba(140,180,100,1)"
            }
        ]
    )

@app.post("/api/sankey", tags=["sankey"])
async def sankey(filterStates: FilterStates) -> List[List[Any]]:
    print(filterStates)
    data = [
        ["From", "To", "Weight"],
        ["A", "X", 5],
        ["A", "Y", 7],
        ["A", "Z", 6],
        ["B", "X", 2],
        ["B", "Y", 9],
        ["B", "Z", 4],
    ]
    return data