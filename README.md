# YM491 - Node.js API

Projedeki kullanıcı giriş çıkış işlemlerinin yapıldığı ve haberlerin, kayıtlı aramaların, yazarlara ait haberlerin servis edildiği json çıktı veren arabirimdir.

## Database

Repo ana dizinininde bulunan [database-dump.zip](https://github.com/nrlozdemir/YM491-API/blob/master/database-dump.zip "database-dump.zip") adlı dosya öncelikle unzip komutu ile dışarı çıkartılır, çıkartılan dosyanın adı ym491.sql olacaktır.
Aşağıdaki komutlar ile mysql sunucuya import edilir.

    mysql -h localhost -u root
    CREATE DATABASE ym491;
    # exit 

    mysql -h localhost -u root ym491 < ym491.sql

## package.json Yapısı ve Kullanılan Paketler

| Paket adı| Açıklama ve yönergeler |
|--|--|
| dotenv | Kullanıcı tanımlı değişkenlerin tanımlanmasını ve kullanılmasını yöneten pakettir. |
| express | Bir javascript uygulamasını web'de yayınlayacak hale getiren paketlerden biridir. Express bir framework'dür ve çeşitli kütüphaneleri vardır. Express ile http istekleri ve dönüş mesajları yönetilebilir. |
| moment | Javascript ile tarih işlemlerini yapabileceğimiz bir kütüphanedir. |
| sequelize | Sequelize bir ORM'dir, veritabanı dilinden bağımsız olarak desteklediği tüm dillerde, sunmuş olduğu metodlar ile veritabanı üstünde işlem yapılmasını sağlar. |
| mysql | Sürücü paketidir, mysql sunucusuna bağlanabilmek için kullanılmaktadır. |
| validator | [validator](https://www.npmjs.com/package/validator "validator") modülü çeşitli veri yapıları üzerinde birçok işlem yapılabilmesini sağlayan bir kütüphanedir. Örneğin `string.isEmpty ya da string.isEmail` |

## Değişkenler

.env dosyasına aşağıdaki satırlar eklenir.
PORT, API yazılımın çalışacağı port numarasını belirlemek için kullanılır.
Diğer satırlar veritabanı sunucusu ile ilgilidir.

    PORT=5000
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=Database-name
    DB_USERNAME=root
    DB_PASSWORD=

## Çalıştırma

Çalışılacak bilgisayarda npm ve node.js (v14.15<=) kurulu olmalıdır.
Repo ana dizininde;

    npm install && npm install -g nodemon && npm run start
komutu ile gerekli javascript bağımlılık paketleri yüklenir ve package.json içindeki start komutu çalıştırılır.

## routes/web.js

Mevcut tüm yönlendirme kurallarının yer aldığı ve bir post veya get gibi isteklerin ekleneceği dosyadır.
Aynı klasöre (path) farklı metodlar ile istek yapılabilir. Ancak aynı klasöre aynı tip metod ile istek gönderilme durumunda en sondaki satır geçerlilik kazanır. 

- `router.post("/login", AuthController.login); # Post metodu ile /login URL'sine istek gönderildiğinde AuthController.login metodu çağrılır. Post parametreleri body'de gönderilmektedir. #index.js 10.satır'da konfigürasyonu yapılmıştır.`
- `router.get("/homepage-news", HomeController.news); # Get metodu ile /homepage-news URL'sine istek gönderildiğinde HomeController.news metodu çağrılır.` 

## Modeller

Proje veritabanında 3 adet tablo yer almaktadır, sırasıyla **my_news**, **news** ve **users**.
Bu tabloların veri yapısı modeller klasöründe ayrı ayrı dosyalarda bulunur. Modeller, komponentler tarafından çağrıldığı zaman veritabanında işlemleri yapabilecek metodları bünyesinde barındırır. Bu metodlar modele Sequelize tarafından aktarılır. Modellerde değişiklik yapıldığı zaman bir sonraki çalışma zamanında yapılan değişiklikler veritabanına senkronize edilir.

## Bir Komponentin İncelenmesi

    const  News = require("../models/News");
    
    exports.news = (req, res, next) => {
        const offset = parseInt(req.params.offset);
        News.count().then((c) => {
            News.findAll({
                offset:  offset * 10,
                limit:  10,
            })
            .then((newsItems) => {
                if (newsItems) {
                    res.send({ data:  newsItems, count:  c });
                }
               })
            .catch((err) =>  console.log(err));
          });
      };

Bu komponentde offset veritabanında kullanılacak bir sonraki indis olarak tanımlanmıştır. Sayfalar değişiktikçe offset +1 değeriyle gelecek olup, 10 ile çarpılarak bir sonraki sayfanın verileri json ile çıktı alınmaktadır.
News bir model sınıfıdır ve sequelize kütüphanesinin tüm metodları News sınıfına aktarılmıştır. 5. satırda count ile metodda tanımlanan veritabanındaki tüm satır sayısı elde edilir ve bir diğer sorguda offset değişkenine bağımlı kalınarak tablodan 10 satır elde edilir.
