# micro-MVC
An agile, small, productive and robust MVC framework.

micro-MVC is a simple, agile but concrete and powerful MVC framework that empowers developers to write 
MVC-based code vey quickly. Although there are tons of free and open source MVC frameworks out there, they 
usually end up to become too complicated and come with a bunch of infinite extensions that only 5% of devs 
really use them.

micro-MVC is trying to be hassle free, straightforward and let you stay to the point.

The main static class you need to call is "MICRO_MVC". Under MICRO_MVC you can call the API.

The small API provides just 5 calls:

1. Go_To($mvc_route, $mvc_args = null) - Go to the specific route and optionally pass any information

2. Setup_Route($mvc_route) - Setup a new route

3. Get_Route($option) - Get this route or all routes [$option: "this" / "all"]

4. Store_Content($mvc_var, $content) - Store any content for this route

5. Show_Content($mvc_var) - Show any content stored for the route you are in now



Best,
George Delaportas (ViR4X)
