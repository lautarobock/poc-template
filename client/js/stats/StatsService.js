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

    exports.myStats = function(ratings) {
        // var breweriesIndex = {};

        var myStats = {
            count: ratings.length,
            rated: 0,
            breweries: [],
            styles: [],
            categories: []
        };

        for( var i=0; i<ratings.length; i++ ) {
            var rating = ratings[i];
            if ( rating.score ) {
                myStats.rated++;
            }
            if ( myStats.breweries.indexOf(rating.beer.brewery) == -1 ) {
                myStats.breweries.push(rating.beer.brewery);
            }
            if ( myStats.styles.indexOf(rating.beer.style) == -1 ) {
                myStats.styles.push(rating.beer.style);
            }
            if ( myStats.categories.indexOf(rating.beer.category) == -1 ) {
                myStats.categories.push(rating.beer.category);
            }
        }

        return myStats;
    }

})(typeof exports === 'undefined'? this['StatsService'] = {} : exports );