

```python
import pandas as pd 
```


```python
purchase_json = "purchase_data.json"
```


```python
purchase_df = pd.read_json(purchase_json)
purchase_df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Age</th>
      <th>Gender</th>
      <th>Item ID</th>
      <th>Item Name</th>
      <th>Price</th>
      <th>SN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>38</td>
      <td>Male</td>
      <td>165</td>
      <td>Bone Crushing Silver Skewer</td>
      <td>3.37</td>
      <td>Aelalis34</td>
    </tr>
    <tr>
      <th>1</th>
      <td>21</td>
      <td>Male</td>
      <td>119</td>
      <td>Stormbringer, Dark Blade of Ending Misery</td>
      <td>2.32</td>
      <td>Eolo46</td>
    </tr>
    <tr>
      <th>2</th>
      <td>34</td>
      <td>Male</td>
      <td>174</td>
      <td>Primitive Blade</td>
      <td>2.46</td>
      <td>Assastnya25</td>
    </tr>
    <tr>
      <th>3</th>
      <td>21</td>
      <td>Male</td>
      <td>92</td>
      <td>Final Critic</td>
      <td>1.36</td>
      <td>Pheusrical25</td>
    </tr>
    <tr>
      <th>4</th>
      <td>23</td>
      <td>Male</td>
      <td>63</td>
      <td>Stormfury Mace</td>
      <td>1.27</td>
      <td>Aela59</td>
    </tr>
  </tbody>
</table>
</div>




```python
#Find total nunmber of players
players = purchase_df["SN"].nunique()
total_players = pd.DataFrame ({
    "Total Players":[players]
})
total_players
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Total Players</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>573</td>
    </tr>
  </tbody>
</table>
</div>



##  Purchasing Analysis (Total)


```python
players = purchase_df["SN"].nunique()
items = purchase_df["Item Name"].nunique()
number_purchases = purchase_df["Price"].count()
total_revenue = purchase_df["Price"].sum()

purchase_analysis_df = pd.DataFrame({
    "Number of Unique Items" : [items],
    "Average Price" : [avg_purchase],
    "Number of Purchases" : [number_purchases],
    "Total Revenue" : [total_revenue]
})

purchase_analysis_df = purchase_analysis_df[["Number of Unique Items", "Average Price","Number of Purchases","Total Revenue"]]
purchase_analysis_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Number of Unique Items</th>
      <th>Average Price</th>
      <th>Number of Purchases</th>
      <th>Total Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>179</td>
      <td>2.93</td>
      <td>780</td>
      <td>2286.33</td>
    </tr>
  </tbody>
</table>
</div>




```python
#Count and percentage of each gender category 
gender = purchase_df["Gender"].value_counts()
gender

```




    Male                     633
    Female                   136
    Other / Non-Disclosed     11
    Name: Gender, dtype: int64



##  Gender Demographics


```python
male_count = len(purchase_df[purchase_df["Gender"] == "Male"])
male_percent = round((male_count/len(purchase_df["Gender"])*100),2)

female_count = len(purchase_df[purchase_df["Gender"] == "Female"])
female_percent = round((female_count/len(purchase_df["Gender"])*100),2)

other_count = len(purchase_df[purchase_df["Gender"] == "Other / Non-Disclosed"])
other_percent = round((other_count/len(purchase_df["Gender"])*100),2)

gender_demographics_df = pd.DataFrame({"Total Count" : [male_count , female_count , other_count],
                                   "Percentage of Players": [male_percent , female_percent, other_percent]},
                                   index = ["Male", "Female", "Other/Non-Disclosed"])


gender_demographics_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Percentage of Players</th>
      <th>Total Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Male</th>
      <td>81.15</td>
      <td>633</td>
    </tr>
    <tr>
      <th>Female</th>
      <td>17.44</td>
      <td>136</td>
    </tr>
    <tr>
      <th>Other/Non-Disclosed</th>
      <td>1.41</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
</div>



##  Purchasing Analysis (Gender)


```python
purchase_by_gender = purchase_df[["Gender","Price"]]

gender_groups = purchase_by_gender.groupby("Gender")
gender_analysis = round(gender_groups[["Price"]].mean(),2)
gender_analysis["Purchase Count"] = gender_groups[["Price"]].count()
gender_analysis["Total Purchase Value"] = gender_groups[["Price"]].sum()
gender_analysis["Normalized Total"] = gender_analysis["Purchase Count"] / len(purchase_df["Gender"])

gender_analysis = gender_analysis.rename(columns = {
    "Price":"Average Purchase Price"
})
gender_analysis = gender_analysis[["Purchase Count", "Average Purchase Price", "Total Purchase Value", "Normalized Total"]]
gender_analysis
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Price</th>
      <th>Total Purchase Value</th>
      <th>Normalized Total</th>
    </tr>
    <tr>
      <th>Gender</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Female</th>
      <td>136</td>
      <td>2.82</td>
      <td>382.91</td>
      <td>0.174359</td>
    </tr>
    <tr>
      <th>Male</th>
      <td>633</td>
      <td>2.95</td>
      <td>1867.68</td>
      <td>0.811538</td>
    </tr>
    <tr>
      <th>Other / Non-Disclosed</th>
      <td>11</td>
      <td>3.25</td>
      <td>35.74</td>
      <td>0.014103</td>
    </tr>
  </tbody>
</table>
</div>




```python
#In bins of 4 years (i.e. <10, 10-14, 15-19, etc.): Purchase Count, Average Purchase Price, Total Purchase Value, 

age_bins = [0, 10, 15, 20, 25, 30, 35, 40, 45, 50]
labels = ["<10", "10-14", "15-19", "20-24", "25-29", "30-34", "35-39", "40-44", "45-49"]

purchase_by_age = purchase_df[["Age","Price"]]
purchase_by_age["Age Group"] = pd.cut(purchase_by_age["Age"], age_bins, labels=labels)
purchase_by_age.head()
```

    C:\Users\McKenzi\Anaconda3\lib\site-packages\ipykernel_launcher.py:7: SettingWithCopyWarning: 
    A value is trying to be set on a copy of a slice from a DataFrame.
    Try using .loc[row_indexer,col_indexer] = value instead
    
    See the caveats in the documentation: http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-view-versus-copy
      import sys
    




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Age</th>
      <th>Price</th>
      <th>Age Group</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>38</td>
      <td>3.37</td>
      <td>35-39</td>
    </tr>
    <tr>
      <th>1</th>
      <td>21</td>
      <td>2.32</td>
      <td>20-24</td>
    </tr>
    <tr>
      <th>2</th>
      <td>34</td>
      <td>2.46</td>
      <td>30-34</td>
    </tr>
    <tr>
      <th>3</th>
      <td>21</td>
      <td>1.36</td>
      <td>20-24</td>
    </tr>
    <tr>
      <th>4</th>
      <td>23</td>
      <td>1.27</td>
      <td>20-24</td>
    </tr>
  </tbody>
</table>
</div>



## Purchase Analysis (Age)


```python
#In bins of 4 years (i.e. <10, 10-14, 15-19, etc.): Purchase Count, Average Purchase Price, Total Purchase Value, 
age_groups = purchase_by_age.groupby("Age Group")
age_demographics = round(age_groups[["Price"]].mean(),2)
age_demographics["Purchase Count"] = age_groups[["Price"]].count()
age_demographics["Total Purchase Value"] = age_groups[["Price"]].sum()
age_demographics["Normalized Total"] = age_demographics["Purchase Count"] / len(purchase_df["Age"])

age_demographics = age_demographics.rename(columns = {
    "Price":"Average Purchase Price"
})
age_demographics = age_demographics[["Purchase Count","Average Purchase Price","Total Purchase Value", "Normalized Total"]]
age_demographics
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Price</th>
      <th>Total Purchase Value</th>
      <th>Normalized Total</th>
    </tr>
    <tr>
      <th>Age Group</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>&lt;10</th>
      <td>32</td>
      <td>3.02</td>
      <td>96.62</td>
      <td>0.041026</td>
    </tr>
    <tr>
      <th>10-14</th>
      <td>78</td>
      <td>2.87</td>
      <td>224.15</td>
      <td>0.100000</td>
    </tr>
    <tr>
      <th>15-19</th>
      <td>184</td>
      <td>2.87</td>
      <td>528.74</td>
      <td>0.235897</td>
    </tr>
    <tr>
      <th>20-24</th>
      <td>305</td>
      <td>2.96</td>
      <td>902.61</td>
      <td>0.391026</td>
    </tr>
    <tr>
      <th>25-29</th>
      <td>76</td>
      <td>2.89</td>
      <td>219.82</td>
      <td>0.097436</td>
    </tr>
    <tr>
      <th>30-34</th>
      <td>58</td>
      <td>3.07</td>
      <td>178.26</td>
      <td>0.074359</td>
    </tr>
    <tr>
      <th>35-39</th>
      <td>44</td>
      <td>2.90</td>
      <td>127.49</td>
      <td>0.056410</td>
    </tr>
    <tr>
      <th>40-44</th>
      <td>3</td>
      <td>2.88</td>
      <td>8.64</td>
      <td>0.003846</td>
    </tr>
    <tr>
      <th>45-49</th>
      <td>0</td>
      <td>NaN</td>
      <td>0.00</td>
      <td>0.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
top_spenders = purchase_df["SN"].value_counts().head()
top_spenders.head()
```




    Undirrala66    5
    Qarwen67       4
    Hailaphos89    4
    Sondastan54    4
    Mindimnya67    4
    Name: SN, dtype: int64



## Top Spenders


```python
#Identify the the top 5 spenders in the game by total purchase value, then list (in a table):
#SN, Purchase Count, Average Purchase Price, Total Purchase Value

top_spenders = purchase_df[["SN","Price"]]
top_5 = top_spenders.groupby("SN")
spender_analysis= round(top_5[["Price"]].mean(),2)
spender_analysis["Purchase Count"] = top_5[["Price"]].count()
spender_analysis["Total Purchase Value"] = top_5[["Price"]].sum()

spender_analysis = spender_analysis.rename(columns = {
    "Price":"Average Purchase Price"
})

spender_analysis = spender_analysis[["Purchase Count","Average Purchase Price", "Total Purchase Value"]]
sorted_spender = spender_analysis.sort_values(["Total Purchase Value"],ascending = False)

sorted_spender.head()

```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>SN</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Undirrala66</th>
      <td>5</td>
      <td>3.41</td>
      <td>17.06</td>
    </tr>
    <tr>
      <th>Saedue76</th>
      <td>4</td>
      <td>3.39</td>
      <td>13.56</td>
    </tr>
    <tr>
      <th>Mindimnya67</th>
      <td>4</td>
      <td>3.18</td>
      <td>12.74</td>
    </tr>
    <tr>
      <th>Haellysu29</th>
      <td>3</td>
      <td>4.24</td>
      <td>12.73</td>
    </tr>
    <tr>
      <th>Eoda93</th>
      <td>3</td>
      <td>3.86</td>
      <td>11.58</td>
    </tr>
  </tbody>
</table>
</div>



## Most Popular Items


```python
popular_items = purchase_df[["Item ID", "Item Name","Price"]]

top_items = popular_items.groupby(["Item ID", "Item Name"])
item_popularity= round(top_items[["Price"]].mean(),2)
item_popularity["Purchase Count"] = top_items[["Price"]].count()
item_popularity["Total Purchase Value"] = top_items[["Price"]].sum()

item_popularity = item_popularity.rename(columns = {
    "Price":"Item Price"
})

item_popularity= item_popularity[["Purchase Count", "Item Price", "Total Purchase Value"]]
sorted_items = item_popularity.sort_values(["Purchase Count"],ascending = False)
sorted_items.head()

item_popularity.head()


```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Purchase Count</th>
      <th>Item Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <th>Splinter</th>
      <td>1</td>
      <td>1.82</td>
      <td>1.82</td>
    </tr>
    <tr>
      <th>1</th>
      <th>Crucifer</th>
      <td>4</td>
      <td>2.28</td>
      <td>9.12</td>
    </tr>
    <tr>
      <th>2</th>
      <th>Verdict</th>
      <td>1</td>
      <td>3.40</td>
      <td>3.40</td>
    </tr>
    <tr>
      <th>3</th>
      <th>Phantomlight</th>
      <td>1</td>
      <td>1.79</td>
      <td>1.79</td>
    </tr>
    <tr>
      <th>4</th>
      <th>Bloodlord's Fetish</th>
      <td>1</td>
      <td>2.28</td>
      <td>2.28</td>
    </tr>
  </tbody>
</table>
</div>



## Most Profitable Items 


```python
most_profitable = purchase_df[["Item ID","Item Name","Price"]]
most_profitable.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Item ID</th>
      <th>Item Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>165</td>
      <td>Bone Crushing Silver Skewer</td>
      <td>3.37</td>
    </tr>
    <tr>
      <th>1</th>
      <td>119</td>
      <td>Stormbringer, Dark Blade of Ending Misery</td>
      <td>2.32</td>
    </tr>
    <tr>
      <th>2</th>
      <td>174</td>
      <td>Primitive Blade</td>
      <td>2.46</td>
    </tr>
    <tr>
      <th>3</th>
      <td>92</td>
      <td>Final Critic</td>
      <td>1.36</td>
    </tr>
    <tr>
      <th>4</th>
      <td>63</td>
      <td>Stormfury Mace</td>
      <td>1.27</td>
    </tr>
  </tbody>
</table>
</div>




```python
profit = most_profitable.groupby(["Item ID","Item Name"])
profit
```




    <pandas.core.groupby.DataFrameGroupBy object at 0x0000025D90886AC8>




```python
highest_profit= profit[["Price"]].mean()
highest_profit.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Price</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <th>Splinter</th>
      <td>1.82</td>
    </tr>
    <tr>
      <th>1</th>
      <th>Crucifer</th>
      <td>2.28</td>
    </tr>
    <tr>
      <th>2</th>
      <th>Verdict</th>
      <td>3.40</td>
    </tr>
    <tr>
      <th>3</th>
      <th>Phantomlight</th>
      <td>1.79</td>
    </tr>
    <tr>
      <th>4</th>
      <th>Bloodlord's Fetish</th>
      <td>2.28</td>
    </tr>
  </tbody>
</table>
</div>




```python
highest_profit["Purchase Count"] = profit[["Price"]].count()
highest_profit["Total Purchase Value"] = profit[["Price"]].sum()
highest_profit.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Price</th>
      <th>Purchase Count</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <th>Splinter</th>
      <td>1.82</td>
      <td>1</td>
      <td>1.82</td>
    </tr>
    <tr>
      <th>1</th>
      <th>Crucifer</th>
      <td>2.28</td>
      <td>4</td>
      <td>9.12</td>
    </tr>
    <tr>
      <th>2</th>
      <th>Verdict</th>
      <td>3.40</td>
      <td>1</td>
      <td>3.40</td>
    </tr>
    <tr>
      <th>3</th>
      <th>Phantomlight</th>
      <td>1.79</td>
      <td>1</td>
      <td>1.79</td>
    </tr>
    <tr>
      <th>4</th>
      <th>Bloodlord's Fetish</th>
      <td>2.28</td>
      <td>1</td>
      <td>2.28</td>
    </tr>
  </tbody>
</table>
</div>




```python
highest_profit= highest_profit[["Purchase Count", "Price", "Total Purchase Value"]]
```


```python
sorted_profit = highest_profit.sort_values(["Total Purchase Value"],ascending = False)
sorted_profit.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Purchase Count</th>
      <th>Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>34</th>
      <th>Retribution Axe</th>
      <td>9</td>
      <td>4.14</td>
      <td>37.26</td>
    </tr>
    <tr>
      <th>115</th>
      <th>Spectral Diamond Doomblade</th>
      <td>7</td>
      <td>4.25</td>
      <td>29.75</td>
    </tr>
    <tr>
      <th>32</th>
      <th>Orenmir</th>
      <td>6</td>
      <td>4.95</td>
      <td>29.70</td>
    </tr>
    <tr>
      <th>103</th>
      <th>Singed Scalpel</th>
      <td>6</td>
      <td>4.87</td>
      <td>29.22</td>
    </tr>
    <tr>
      <th>107</th>
      <th>Splitter, Foe Of Subtlety</th>
      <td>8</td>
      <td>3.61</td>
      <td>28.88</td>
    </tr>
  </tbody>
</table>
</div>


