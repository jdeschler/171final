CS 171 Final Project
Societal Collapse in the Hive
Jack Deschler, Leyla Brittan, Michael Scott, Caroline Gutierrez

PROJECT OVERVIEW

Our project “Societal Collapse in the Hive” aims to provide information about honeybee colony loss in the United States
and to consider some of the repercussions of this decline.

Our first visualization shows how honey bee colony loss affects crop production values in the United States. The user
can click the “start” button of the visualization in order to watch how colony loss (represented by hexagons which
change from yellow to gray) impacts U.S. crop value.

The next section of the web page introduces colony collapse disorder and has an image carousel showing both healthy and
abandoned hives.

The second interactive visualization on the page enables the user to explore colony loss by state with a choropleth map.
The user can scroll over individual states to see a tooltip with state-specific colony loss data. The user can select a
time frame between 1987 and 2018 to see the colony loss by state within the given time interval. The second part of the
visualization is a flower with petals which represent colony loss by region, specifically US census division.

The next interactive visualization is an area chart with a brushable timeline that shows National Honey Production
between 1987 to 2017. The user can isolate specific timeframes between these years. The user can mouseover the data
points in this visualization to see a tooltip with the honey production in lbs in the selected year.

Scrolling down, the user can explore the causes of colony collapse disorder.

In the Neonicotinoids section the user can find information on a class of insecticides which negatively impact honeybee
health. It includes a bar chart on Neonicotinoid usage in the US over time.

The final section of the web page provides information on the Varroa destructor, a type of parasitic mite that is
responsible in part for colony collapse.

We hope that the visualizations in our project will educate visitors about the possible causes and consequences of
declining honeybee population, and bring more attention to a phenomenon that could become a major issue in future years.

CODE OVERVIEW

The vast majority of the code that we wrote for this project was written by ourselves, adapting code that we had written for Labs and Homework assignments throughout the course. As a result, the visualizations are built almost entirely using the D3 library as we learned in class.

For some of the more difficult visualizations, we had to adapt code that was pre-written on the Internet. We did this for the flower visualization, adapting code from http://bl.ocks.org/herrstucki/6199768?fbclid=IwAR1Gc-Bpk-GBaSM4Y13jViCO7h7CuudiYm9pc4Nk3WfMfr6o5NQvHjwRoDs, and for the mesh of hexagons that represent beehives, adapting code from https://bl.ocks.org/mbostock/5249328?fbclid=IwAR3mm-lVv0is1fmY7ShvWgMCJEfRAPbjfcat7H6B1rTtMLeWaWcyT2V9LHM.

Finally, we adapted code for the navigation bar from https://www.w3schools.com/bootstrap4/bootstrap_scrollspy.asp?fbclid=IwAR3KZ8F1ggRol5e0AxjMrC7T43QdJrjryjsS2DMnpBvZohIxxVH5xzawNPo 

LINKS

Project site: jdeschler.github.io/171final/implementation

Screencast: https://vimeo.com/303942678?fbclid=IwAR2QbmS6BtY5xddBrIPEpElaUoX-4t9vbc52eIYV7n7_B-wLdbixALYGo-Y 

Image carousel code adapted from Bootstrap documentation: https://getbootstrap.com/docs/4.0/components/carousel/
Navbar and scrollspy functionality implemented using Bootstrap, code adapted from https://www.w3schools.com/bootstrap4/bootstrap_scrollspy.asp

Honey Area Chart Citations: Lab 6, tool tips: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369, valueline: https://bl.ocks.org/d3noob/119a138ef9bd1d8f0a8d57ea72355252, scatterplot: http://bl.ocks.org/d3noob/38744a17f9c0141bcd04, clip path: https://bl.ocks.org/mbostock/4015254, labeling axes: https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e, comma formatting for lbs: http://bl.ocks.org/mstanaland/6106487.