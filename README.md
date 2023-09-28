# Nearipedia

## What is Nearipedie

It a encyclopedia of places near you. Tourist attactions? Nearest toilet? It can all be here with a little configuration.  

## Overview

Nearipedia uses Wikipedia Geoserch API to display articles near you as well as Overpass API to fetch data from OpenStreetMap

## Adding tags/articles

1. Click the middle button on the bottom of the screen
2. Click on `Add tag` button.
3. Fill values in pop-up that appears:

| Field | Value | Example |
|:-----:|-------|---------|
| `service` | `OpenStreetMap tags` or `Wikiedia language` | N/A |
| `key and/or value` | For Wikipedia: [ISO 639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) <br/> For OSM: tag or tag=value pair. (some regex can be used as well - see below) | `en`, `pl`, `de` |
| `label/name` | (optional) | `Public Toilets` |
| `icon` | emoticon or one of [Google Material Icons](https://marella.me/material-icons/demo) | `🅿️`, `local_parking`|

## Enabling/Disabling Tags

1. Display Tags by clicking middle button on the bottom of the screen
2. Click on tag

## Removing Tags

1. Display Tags by clicking middle button on the bottom of the screen
2. Hold tag for about 2 seconds until it disappears.

---

## Useful tags

<details><summary>Tourism</summary>

+ `amenity=parking`
  + `vending=parking_tickets`
+ `tourism=information`
+ `amenity=shelter` & `shelter=yes`
  + `shelter_type=picnic_shelter`
+ `amenity=drinking_water` & `drinking_water=yes`
+ `tourism=artwork`
  + `artwork_type=sculpture`
+ `tourism=viewpoint`
+ `leisure=picnic_table` & `amenity=bench` & `bench=yes`
+ `tourism=picnic_site`
+ `tourism=camp_site`

  <details><summary>Bicycle Trips</summary>

    ``

  </details>

  <details><summary>Hiking Trips</summary>



  </details>

  <details><summary>Sightseeing</summary>



  </details>

  <details><summary>Historic Tour</summary>

  + `historic=yes`
  + `historic=ruins`
  + `historic=wayside_shrine`
  + `archaeological_site=fortification`
  + `memorial=war_memorial`
  + `historic=tomb`
  + `historic=castle`

  </details>

  <details><summary>Natural Areas</summary>

  + `leisure=park`
  + `natural=cliff`
  + `leisure=picnic_table`
  + `natural=spring`
  + `natural=hill`
  + `natural=stone`

  </details>

</details>

<details><summary>Urbex</summary>

+ `ruins=yes`
+ `building=ruins` (*powinien oznaczać tylko budynki wzorowane na ruiny)

</details>

<details><summary>Basic Needs</summary>

+ `amenity=parking`
+ `amenity=toilets` & `toilets=yes`

</details>











Fastfood
amenity=vending_machine

Access=private
Highway=crossing

man_made=tower

man_made=manhole



man_made=bridge
amenity=hospital
man_made=surveillance

railway=crossing

amenity=fountain

man_made=water_tower

building=hospital

building=hotel
place=island

internet_access:fee=no


building=collapsed
tourism=camp_pitch
shop=variety_store

waterway=waterfall
board_type=history
leisure=fitness_station
building=bunker


amenity=ice_cream
barrier=city_wall
landuse=flowerbed
tourism=motel
amenity=water_point
sport=climbing
shop=beverages
brand=McDonald's


shop=deli
leisure=dog_park


amenity=waste_basket
bin=yes



Shop
Bakery
Convenience
department_store
Supermarket
Erotic

