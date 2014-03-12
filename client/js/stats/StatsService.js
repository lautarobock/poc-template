(function(exports) {
    /*
    - Genenral
     - Cantidad de Tomadas
     - Cantidad puntuada
     - Cantidad de cervecerias
     - Cantidad de Esilos
     - Cantidad de categorias
     - Con mas %. Top 3 & Bottom 3
     - Con mas ptos. Top 3 & Bottom 3
     - Con max IBUS. Top 3 & Bottom 3
    - Por cantidad
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)
    - Por Puntaje
     - Por mes, 12 meses.
     - Por estilo. (3 estilos + otros)
     - Por categoria. (3 cat + otros)
     - Por cerveceria. (3 cerv + otros)
    */    

    /*
    exports.Rating = mongoose.model("Rating", new Schema({
        beer: {
            name: String,
            style: {type: String, ref: 'Style'},
            styleByLabel: {type: String, ref: 'StyleByLabel'},
            category: {type:String, ref:'Category'},
            calories: Number,
            abv: Number,
            ibu: Number,
            og: Number,
            fg: Number,
            srm: Number,
            brewery: {type: String, ref: 'Brewery'}
        },
        score: {
            aroma: Number,
            appearance: Number,
            flavor: Number,
            mouthfeel: Number,
            overall: Number
        },
        finalScore: {type: Number, default: null},
        bottled: Date,
        expiration: Date,
        date: Date
    }));
    */

    function createCountAvg(_id) {
        return {
            _id: _id,
            count: 0,
            avg: {
                count: 0,
                sum: 0
            }
        };
    }

    function compareItem(value) {
        return function(item) {
            return item._id == value ? 0 : -1;
        }
    }

    function calculateAvg(item) {
        if ( item.avg.count != 0 ) {
            item.avg.value = Math.round((item.avg.sum/item.avg.count)*10)/10;    
        } else {
            item.avg.value = null;
        }
    }    

    exports.myStats = function(ratings) {
        // var breweriesIndex = {};

        var uniqueTmp = {};

        var myStats = {
            count: ratings.length,
            rated: 0,
            unique: 0,
            breweries: [],
            styles: [],
            categories: [],
            months: [],
            countries: [],
            locations:[],
            firstInDate: null,
            lastInDate: null
        };

        for( var i=0; i<ratings.length; i++ ) {
            var rating = ratings[i];
            if ( rating.score ) {
                myStats.rated++;
            }

            if ( !myStats.firstInDate ) {
                myStats.firstInDate = new Date(rating.date);
            } else {
                myStats.firstInDate = new Date(Math.min(new Date(rating.date).getTime(), myStats.firstInDate.getTime()));
            }

            if ( !myStats.lastInDate ) {
                myStats.lastInDate = new Date(rating.date);
            } else {
                myStats.lastInDate = new Date(Math.max(new Date(rating.date).getTime(), myStats.lastInDate.getTime()));
            }
            
            uniqueTmp[rating.beer._id] = (uniqueTmp[rating.beer._id]||0) + 1;

            //Breweries
            var index = util.Arrays.indexOf(myStats.breweries, compareItem(rating.beer.brewery));
            if ( index  == -1 ) {
                myStats.breweries.push(createCountAvg(rating.beer.brewery));
                index = myStats.breweries.length - 1;
            }
            myStats.breweries[index].count ++;
            if ( rating.finalScore ) {
                myStats.breweries[index].avg.sum += rating.finalScore;
                myStats.breweries[index].avg.count++;
            }

            //Styles
            index = util.Arrays.indexOf(myStats.styles,  compareItem(rating.beer.style));
            if ( index == -1 ) {
                myStats.styles.push(createCountAvg(rating.beer.style));
                index = myStats.styles.length - 1;
            }
            myStats.styles[index].count ++;
            if ( rating.finalScore ) {
                myStats.styles[index].avg.sum += rating.finalScore;
                myStats.styles[index].avg.count++;
            }
            
            //Categories
            index = util.Arrays.indexOf(myStats.categories, compareItem(rating.beer.category));
            if ( index == -1 ) {
                myStats.categories.push(createCountAvg(rating.beer.category));
                index = myStats.categories.length - 1;
            }
            myStats.categories[index].count ++;
            if ( rating.finalScore ) {
                myStats.categories[index].avg.sum += rating.finalScore;
                myStats.categories[index].avg.count++;
            }

            //country
            if ( rating.country ) {
                index = util.Arrays.indexOf(myStats.countries, compareItem(rating.country));
                if ( index == -1 ) {
                    myStats.countries.push(createCountAvg(rating.country));
                    index = myStats.countries.length - 1;
                }
                myStats.countries[index].count ++;
                if ( rating.finalScore ) {
                    myStats.countries[index].avg.sum += rating.finalScore;
                    myStats.countries[index].avg.count++;
                }    
            }

            //Location
            if ( rating.location && rating.location.name ) {
                index = util.Arrays.indexOf(myStats.locations, compareItem(rating.location.name));
                if ( index == -1 ) {
                    var countAvg = createCountAvg(rating.location.name);
                    // countAvg.name = rating.location.formatted_address;
                    countAvg.location = rating.location;
                    myStats.locations.push(countAvg);
                    index = myStats.locations.length - 1;
                }
                myStats.locations[index].count++;
                if ( rating.finalScore ) {
                    myStats.locations[index].avg.sum += rating.finalScore;
                    myStats.locations[index].avg.count++;
                }
            }
            

            //By Month (_id:'aaaa_mm')
            var date = new Date(rating.date);
            var month = (date.getYear()+1900) + '_' + util.pad(date.getMonth()+1,2);
            index = util.Arrays.indexOf(myStats.months, compareItem(month));
            if ( index == -1 ) {
                myStats.months.push(createCountAvg(month));
                index = myStats.months.length - 1;
            }
            //Just count
            myStats.months[index].count ++;
        }

        angular.forEach(uniqueTmp, function(value,key) {
            myStats.unique++;
        });

        angular.forEach(myStats.breweries, calculateAvg);
        angular.forEach(myStats.categories, calculateAvg);
        angular.forEach(myStats.styles, calculateAvg);
        angular.forEach(myStats.countries, calculateAvg);
        angular.forEach(myStats.locations, calculateAvg);

        if ( myStats.firstInDate && myStats.lastInDate ) {
            //le sumo un dia para poder dias enteros
            var diff =  (1000*60*60*24) + myStats.lastInDate.getTime() - myStats.firstInDate.getTime();
            diff = diff / (1000*60*60*24);
            myStats.avgByDay = myStats.count / diff;
        }

        return myStats;
    }

})(typeof exports === 'undefined'? this['StatsService'] = {} : exports );