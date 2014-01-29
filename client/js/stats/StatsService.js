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

            function breweryComp(item) {
                return item._id == rating.beer.brewery ? 0 : -1;
            }

            var index = -1;
            if ( ( index = util.Arrays.indexOf(myStats.breweries, breweryComp)) == -1 ) {
                myStats.breweries.push({
                    _id: rating.beer.brewery,
                    count: 0,
                    avg: -1
                });
                index = myStats.breweries.length - 1;
            }
            myStats.breweries[index].count ++;

            function idComp(item) {
                return item._id == rating.beer.style ? 0 : -1;
            }

            index = -1;
            if ( (index = util.Arrays.indexOf(myStats.styles,  idComp)) == -1 ) {
                myStats.styles.push({
                    _id: rating.beer.style,
                    count: 0,
                    avg: {
                        count: 0,
                        sum: 0
                    }
                });
                index = myStats.styles.length - 1;
            }
            myStats.styles[index].count ++;
            if ( rating.finalScore ) {
                myStats.styles[index].avg.sum += rating.finalScore;
                myStats.styles[index].avg.count++;
            }
            

            function catComp(item) {
                return item._id == rating.beer.category ? 0 : -1;
            }

            index = -1
            if ( (index = util.Arrays.indexOf(myStats.categories, catComp) )  == -1 ) {
                myStats.categories.push({
                    _id: rating.beer.category,
                    count: 0,
                    avg: -1
                });
                index = myStats.categories.length - 1;
            }
            myStats.categories[index].count ++;
        }

        angular.forEach(myStats.styles, function(style) {
            if ( style.avg.count != 0 ) {
                style.avg.value = Math.round((style.avg.sum/style.avg.count)*10)/10;    
            } else {
                style.avg.value = null;
            }
        });

        return myStats;
    }

})(typeof exports === 'undefined'? this['StatsService'] = {} : exports );