## dynamically set token in postman

> in login route in postman go to Test tab and write below code:

```
 const jsonData=pm.response.json();
 pm.globals.set("token",jsonData.token);
```

> and then press on send button.

- by this way token will be set dynamically and you can use it in other routes.

- now we will go to any route which is protected.and need token:

> for example: getAllJobs route,

> we will go to Authorization tab and select Bearer Token,
 and in the box below write: {{token}} and press on send button.

> done. by this way we can easily set token dynamically and use it in other routes.

*and we will do the same code paste in register route Test tab.because,
in register route we will get token there like login route and we have to set it 
again* 

*added postman documentation link in the end of this file.*
[postman documentation](https://documenter.getpostman.com/view/20773865/2s93RTSDGP#14e7c6df-9a04-433a-b44a-917b76f521fe)