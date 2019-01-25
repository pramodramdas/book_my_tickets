# book_my_tickets
This is movie ticket reservation system built on ethereum.

##### Note: bookmytickets contract not yet committed.

##### whitepaper: https://www.academia.edu/38142412/reservation_system_blockchain.pdf
##### demo: http://bookmytickets.herokuapp.com/home
##### Note: Demo url to work you need to have metamask extension installed in your browser and to buy fake tickets you need to have fake ethers from rinkeby faceut.

#### Summary
Data will be stored in two parts ie. movie info, cinema hall info etc in mongodb and ticket info, resale info, show price, user balance etc in ethereum.
- Admin adds movies, cinema_halls, locations and languages to db(mongodb)
- Admin adds shows and movie price to ethereum, which will be stored in db as well.
- User can search movie, select show and buy ticket buy paying ticket price in ethers.
- User can mark ticket for resale.
- User can search for resale tickets.
- User can buy resale ticket buy paying exact price amount payed by original ticket owner. ethers will be sent to contract, contract will add ethers to owner address.
- Original ticket owner can view and withdraw ether balance(withdraw pattern).

#### Home Page http://bookmytickets.herokuapp.com/home
User can search movie by selecting location and language.  
![Alt text](images/home.png?raw=true "home")  

On click of movie navigates to movie info  
![Alt text](images/movie_info.png?raw=true "movie info")  

On select of Booking, navigates to show booking. select date(end date)  
##### Note: select date after MAY 3 2019, as shows are configured on may 1,2,3
![Alt text](images/book.png?raw=true "booking")  

On click of show, navigates to seat selection  
##### Note: one ticket can be selected at a time, this is because of solidity don't take array as parameter at the time of contract development.
![Alt text](images/seat.png?raw=true "seating")  
Select seat and pay ethers to confirm.  
##### Note: you have to pay exact price else contract will fail.

#### Profile Page http://bookmytickets.herokuapp.com/profile
![Alt text](images/profile.png?raw=true "profile")  

you can also mark ticket for resale, ticket will be just marked for resale. when other users search for resale tickets, your ticket will be listed.  

#### Resale Page http://bookmytickets.herokuapp.com/resale
##### Note: Use another account
Search by selecting movie name, language and location  
![Alt text](images/resale.png?raw=true "resale")  
You can buy resale ticket by paying exact amount of ethers what owner paid.  

Now owner can visit profile page and withdraw the ether by entering in text field.

