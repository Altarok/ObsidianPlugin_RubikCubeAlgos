<img width="1055" height="342" alt="image" src="https://github.com/user-attachments/assets/358ab62c-d163-416b-995f-b47033c0bda7" />

# Rubik Cube algorithms
Obsidian plugin one can use to visualize Rubik Cubes algorithms.

Right now, it is able to show PLL algorithms only.
Working on OLL and F2L.

A normal usecase would look like this image.
A cube with some arrows, followed by your favourite algorithm to solve it:

<img width="381" height="356" alt="image" src="https://github.com/user-attachments/assets/768f0602-750f-4a62-93f2-3b44b513e6ac" />

This exact image is created by writing the following codeblock (named 'rubikCubePLL'):
```
dimension:3,3
arrows:4+8,3+9
```
## Where to start?
Use this command and fiddle with the inserted template:
<img width="742" height="110" alt="image" src="https://github.com/user-attachments/assets/24c2fe64-5ca0-4b8a-b03b-81039861dcf0" />



# Configuration
## Possible configuration
- the cube's size, width and height from 2 to 10
- the cube's color, 3- or 6- digit hex-value
- the arrows' color, 3- or 6- digit hex-value
- arrow coordinates

## Default configuration
```rubikCubePLL
dimension:3,3 // width, height
cubeColor:ff0 // yellow background 
arrowColor:08f // sky blue arrows
// no arrows
```

## Some Examples
```
dimension:2,2 // width, height
arrows:1.1-1.2
```
Would create a 2x2 Cube with an arrow from the first to the second rectangle in the first row.
Arrow coordinates go from top-left to bottom-right. First integer is row, second integer is column.
```
dimension:2,2
arrows:1-2 // "lazy" coordinates
```
Would create the same. Notice the "lazy" arrow coordinates.
It just gives each rectangle an integer. 
```
dimension:2,2
arrows:1+2 // "+" makes this a double-sided arrow
```
Would create the same, but with a double-sided arrow.
```
dimension:2,2
cubeColor:0f0 // green, no "#" for hex value
arrowColor:f00 // red, "ff0000" is also possible
arrows:1-2
```
Would create the same, but with a red arrow on a green cube.

## Things that will come
- OLL visualization
- F2L visualization
- plugin settings
- size configuration


This is my first public repository and plugin, please be gentle :)
Feedback welcome

