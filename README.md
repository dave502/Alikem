**Project url: https://alikem.com**  
<br>

> [!NOTE]
>  ***This project is in the early stages of development!***  
>  If anyone sees this project and notices corrections and improvements that need to be made, please make a pull request 
or just write to me with your suggestions. For now I am not a professional developer and am just learning.
___
This project was created for educational purposes to explore the neo4j database. But then I thought that maybe this 
project would be interesting to someone else. Maybe this project will be able to bring people together, who feel 
the same or think about the same things. Or encourage people to do a little more good. Yes, I know it seems very naive 😄  
The project is in the very early stages of development, so it has minimal functionality and has not been properly tested.  
I am working on the project in my free time, so the project is not developing as quickly as I would like.
___

<h3>The essence of the project</h3>  

When registering, the user makes a donation to a charitable organization (currently it's not working), then 
enters 100 or more words that characterize him. These could be the names of books, films, hobbies, or just random thoughts.
Using the magic of chatGPT's technologies, these words are converted into a vector, which is then compared with the vectors
of other users, and thus people with similar interests and thoughts find each other.
___
> [!IMPORTANT]
> **Features of the project**  
> * All user authorization data is stored in the Firebase service from Google.
> * For now the words entered by the user are stored in the database. But in the future, only the digital vector will be stored. 
Therefore, there is no way to view or edit words (both your own and those of other users).
> * For now user can enter his words only once, in the future this limitation will be eliminated.
___  
> [!WARNING]
> **Some known significant bugs**
> * The application does not display correctly on portable devices.
> * Uploading a photo in the user profile does not work.
> * When adding/removing friends, you need to refresh the page.
> * Authorization is currently available only via email and telegram.
> * etc.
<br>   
<br> 
<br> 
<br> 
  
_Some ideas for the chat backend was found in project https://github.com/omept/go-chat._
