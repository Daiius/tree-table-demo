# tree-table-demo
This is a demo program of a web application
with a database which has both characteristics of tree and table.

Let's assume that we are going to make some great dry tomatoes.
We have several processes to make them:
- select tomatoes (variety, origin, etc...)
- cut them (size, tool, etc...)
- dry them (temperature, time, etc...)

You may be able to do these steps one at a time & in order (material -> cut -> dry),
but you may need to be creative to get the quality the chef appreciates
(e.g. material -> cut -> dry -> cut -> dry -> dry (with different conditions) ).

To efficiently search for the best order & conditions,
it would be effective to process some of the tomatoes with
different conditions from the middle:
material -> cut -> dry --> cut -> dry
                       \-> dry -> cut

Also, we have several properties to measure quality of raw/processed tomatoes:
- sugar content
- moisture content
- umami content

Of course, we measure the finished product,
but we may also measure it during production if necessary.

Additionally, our client requires these features:
- When users add/change tables/columns of process/evaluation, the application should handle it without code changes
- To compare order/conditions, the target data sould be in one table

Now we are going to design a 3-layer web application (database, web api, web app)
to realise these features.

## Database
Naive tree is 

## Web API

## Web App
