const express = require("express");
const app = express();

const db = require("./db");
const{ conn, Person, Place, Thing, Souvenir} = db;
app.use(express.urlencoded({extended:false}));
app.use(require("method-override")('_method'));

app.post('/', async(req,res,next)=>{
    
    try{
        await Souvenir.create(req.body);
        res.redirect('/');
    }catch(er){next(er)};
});
app.delete('/:id', async(req,res,next)=>{
    try{
        const souvenir = await Souvenir.findByPk(req.params.id);
        await souvenir.destroy();
        res.redirect('/');
        
    }catch(er){next(er);}
});

app.get('/',async(req,res,next)=>{
   
   try{
       const people = await Person.findAll();
       const places = await Place.findAll();
       const things = await Thing.findAll();
       const souvenirs = await Souvenir.findAll({
           include:[Person, Place, Thing]
       });
       res.send(`
       
       <!DOCTYPE html>
       <html>
       <head>
       <title>Acme People, Places and Things</title>
       </head>
       <body>
       <h1>Acme People, Places and Things</h1>
       <h2>People</h2>
       <ul>
       ${
           people.map(
           currentValue=>{
               return `<li>
               ${currentValue.name}</li>`;
           }
           ).join('')
       }
       </ul>
        <h2>Places</h2>
       <ul>
       ${
           places.map(
           currentValue=>{
               return `<li>
               ${currentValue.name}</li>`;
           }
           ).join('')
       }
       </ul>
        <h2>Things</h2>
       <ul>
       ${
           things.map(
           currentValue=>{
               return `<li>
               ${currentValue.name}</li>`;
           }
           ).join('')
       }
       </ul>
        <h2>Souvenirs</h2>
       <ul>
       ${
           souvenirs.map(
           currentValue=>{
               return `<li>
               ${currentValue.person.name} purchased a ${currentValue.thing.name} in ${currentValue.place.name}
               <form method='POST' action='/${currentValue.id}?_method=DELETE'>
               <button>Delete</button>
               </form>
               </li>`;
           }
           ).join('')
       }
       </ul>
       <form method='POST' action='/'>
        <select name='personId'>
        ${
            people.map(currentValue=>{
                return `
                <option value='${currentValue.id}'>
                ${currentValue.name}
                </option>
                `;
            }).join('')
        }
        </select>
        <select name='placeId'>
        ${
            places.map(currentValue=>{
                return `
                <option value='${currentValue.id}'>
                ${currentValue.name}
                </option>
                `;
            }).join('')
        }
        </select>
         <select name='thingId'>
        ${
            things.map(currentValue=>{
                return `
                <option value='${currentValue.id}'>
                ${currentValue.name}
                </option>
                `;
            }).join('')
        }
        </select>
        <button>Create</button>
       </form>
       </body>
       </html>
       
       `);
   }
   catch(ex){
       next(ex);
   }
    
});


const init = async()=>{
    try{
        await conn.sync({force: true});
        const [moe, larry, lucy, ethyl, paris, nyc, chicago, london, hat, bag, shirt, cup]=await Promise.all([
         Person.create({name:'moe'}),
         Person.create({name:'larry'}),
         Person.create({name:'lucy'}),
         Person.create({name:'ethyl'}),
         Place.create({name:'paris'}),
         Place.create({name:'nyc'}),
         Place.create({name:'chicago'}),
         Place.create({name:'london'}),
         Thing.create({name:'hat'}),
         Thing.create({name:'bag'}),
         Thing.create({name:'shrit'}),
         Thing.create({name:'cup'}),
            ]); 
         await Promise.all([
             Souvenir.create({personId: moe.id, placeId: london.id, thingId:hat.id}),
             Souvenir.create({personId: moe.id, placeId: paris.id, thingId:bag.id}),
             Souvenir.create({personId: ethyl.id, placeId: nyc.id, thingId:shirt.id}),
             ]);
         const port = process.env.PORT || 3000;
         app.listen(port, ()=>{
             console.log(`listening on port ${port}`);
         });
    }
    catch(er){
        console.log(er);
    }
};

init();