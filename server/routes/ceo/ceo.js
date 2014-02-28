
var robots_txt = 
                'User-agent: Googlebot\n' +
                'User-agent: Googlebot-News\n' +
                'User-agent: * \n' +
                'Sitemap: http://www.birrasquehetomado.com.ar/sitemap.xml\n' +
                'Sitemap: http://www.birrasquehetomado.com.ar/sitemap.txt'

exports.configure = function(app) {
    app.get("/robots.txt",function(req, res) {
        res.writeHeader(200, {"Content-Type": "text/plain"});
        res.write(robots_txt);
        res.end(); 
    });

    app.get("/sitemap.txt", function(req, res) {
        res.writeHeader(200, {"Content-Type": "text/plain"});
        res.write("http://www.birrasquehetomado.com.ar/html/#/beer\n");
        for ( var i=1; i<=23; i++ ) {
            var v=''+i;
            if ( i<10) {
                v='0'+i;
            }
            res.write("http://www.birrasquehetomado.com.ar/html/#/beer?%5Bcategory%5D="+v+"\n");
        }
        
        res.end();  
    });

    app.get("/sitemap.xml", function(req, res) {
        var now = new Date();
        var date = (now.getYear()+1900)+'-'+(now.getMonth()+1)+'-'+now.getDate();
        res.writeHeader(200, {"Content-Type": "text/xml"});
        res.write('<?xml version="1.0" encoding="UTF-8"?>\n');
        res.write(' <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
        for ( var i=1; i<=23; i++ ) {
            res.write('     <url>\n');
            var v=''+i;
            if ( i<10) {
                v='0'+i;
            }
            res.write("         <loc>http://www.birrasquehetomado.com.ar/html/#/beer?%5Bcategory%5D="+v+"</loc>\n");
            res.write("         <lastmod>"+date+"</lastmod>\n");
            res.write("         <changefreq>daily</changefreq>\n");
            res.write("         <priority>0.5</priority>\n");
            res.write('     </url>\n');
        }
        
        res.write(' </urlset>\n');
        res.end();  
    });

};