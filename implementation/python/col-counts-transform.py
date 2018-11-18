# Code for transforming colony-counts.csv
# Jack Deschler, CS 171 Final Project
import pandas as pd

df = pd.read_csv("../data/colony-counts.csv")
df = df.drop("Period", axis = 1)
df.Value = df.Value.apply(lambda x: int(x.replace(",", "")))
df.State = df.State.apply(lambda x: x.lower().capitalize())

table = pd.pivot_table(df, index="State",columns="Year",values="Value")

table.to_csv("../data/colony-counts-transformed.csv")
