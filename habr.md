# Опыт написания игры на TypeScript и WebGL или сказ о том, как backend-щик в современный frontend окунулся

Доброго времени суток всем хаброжителям. Хочу рассказать вам о том, как я вернулся в любительский геймдев спустя 3+ года, кардинально сменив инструмент (а попутно — и свое мировоззрение), и что из этого вышло. Под катом вас ждет:

1. Краткая диспозиция всех фактов в начале пути. Как картинка «ДО» в дешёвой интернет-рекламе «ДО» и «ПОСЛЕ».
1. Добровольный нырок в современный frontend в стиле «Где деньги, Лебовски?!»
1. Легкий зуд в интимной точке, переходящий в жгучее желание изучить что-то новое, сделав что-нибудь старое.
1. Осознание собственной беспомощности
1. Преодоление
1. Приятное окончание, ну совсем как в этих ваших фильмах.

>>>habra cut

## Гражданин, представьтесь!
В своей предыдущей статье (https://habrahabr.ru/post/244417/) я немного писал о себе, а точнее о том, как связан я и геймдев. Де юро — никак, де факто — пишу игры и движки для удовольствия и участия в теплых и ламповых конкурсах. С тех пор мало что изменилось.

Для дальнейшего повествования и нагнетения необходимой атмосферы важно то, что на момент начала этого сказа я являюсь профессиональным .net backend developer, который умеет в html5, css3 и ... jquery. Для укрепления неожиданного «вот это поворот»-а добавим, что имеется недоверие и брезгливость к JavaScript, приправленная а) откровенным непониманием всего этого хайпа вокруг языка и б) набором шуток про типизацию, ускоренное устаревание фреймворков, number+string-неожиданностей и прочим. Знаете, такой вполне стандартный, джентльменский набор разработчика, использующего более взрослый и устоявшийся язык (эй, я знаю, что платформа .net моложе js, но "взрослый" не в прямом смысле).

## Пройдемте!
Сентябрь 2017. Я вышел на новую теплую и ламповую работу со свежим стеком технологий (.net core web api + angular 4) и моей задачей был только бекенд. Слово Angular звучало для меня ругательно, npm и nodejs прочно ассоциировались со смузи и гироскутером. Тимлид, видя это и относясь с пониманием, провел мне короткий курс о том, как запускать все это шайтанство. Аккурат как в том анекдоте про чукчу и собак в космосе. Я запоминаю нужные для запуска bat-ники (запоминание npm run start я посчитал крайне излишним для своей нежной натуры), и погружаюсь в теплый и ~~ламповый~~ светодиодный net core.

Октябрь 2017. Первый звоночек. Тимлид говорит, что наш фронтедщик зашивается на 4-х проектах сразу и предлагает впилить какой-то там раздел в админке мне. Мотивируя, что, мол, там несложно, просто повтори как сделано для сущности N, только теперь для M. Под смешки коллег, убегающих за гироскутером и вейпом для меня, наспех прочитав какой-то короткий ликбез по Angular, путем копипаста и везения, я рожаю какой-то раздел, который, с оговорками, работает. Тимлид доволен, я в шоке, и вот вроде бы и задачки по бекенду на доске появились...

Но нет. Бекендщиков много, задач для них уже мало, а на фронте — непаханное поле. Новая задача, уже непосредственно на портале, заставляет меня взяться за дело всерьез. Коллеги норовят подвернуть мне штаны и отвести в барбершоп, а я на недельку погружаюсь в чтение материалов по Angular, TypeScript, npm, webpack и прочему. Кстати, отлично помогла статья про современный Javascript для динозавров — https://habrahabr.ru/company/mailru/blog/340922/. 

Спустя некоторое время я смог закрывать несложные фронтенд-задачи, чувствуя себя как привратник в отсутствие горничной. Все еще посмеиваясь над шутками про фронтенд, я предлагаю коллегам-бекендщикам собраться и послушать мой бананово-клубничный опыт. Все смеются, но в тайне каждому хочется понять, что за бурление происходит в этом стремительном фронтенде (на самом деле, нет).

Я, немудрствуя лукаво, пересказываю вышеупомянутуюу статью с хабра, приправляя ее своими базовыми знаниями по Angular. Митап заходит на ура, и, впоследствии, я провожу целую серию таких — о фронтенде для бекендщиков, что, впрочем, уже не так важно для нашего сказа. Важно лишь то, что их проведение сподвигло меня самого на более глубокое изучение современного стека технологий фронтенда.

## Зуд
На работе все складывалось, в семейной жизни тоже наступило довольно спокойное время, и появился зуд. Такой, знаете ли, маленький, еще совсем неокрепший и живущий где-то на границе подсознания. В голове мелькали мысли, мол, три года назад я практически полностью перестал заниматься своим хобби — программированием игр. А что если совместить свежие знания и?..

Я давно смотрел на WebGL, но ранее меня отпугивало отсутствие всякой помощи (типизации, автодополнения) при его использовании. А тут, пожалуйста — несуществующая серебряная пуля во плоти, Тот самый молоток, при взятии которого все **становится** гвоздями. TypeScript.

Мне, как человеку, познавшему боль с callback hell, var self = this, bind(this), udefined is not a function... Так вот, мне TypeScript показался даже не глотком свежего воздуха, а эдаким вошлебником на голубом звездолете, который, спустившись с небес, лениво бросил мне — сынок, забудь все, что ты знал о js раньше, и я покажу тебе, насколько глубока кроличья нора. Аналогия выглядит сумбурной и вообще какой-то солянкой из других аналогий? Верно, как и сам TypeScript с первого взгляда.

Классы, интерфейсы, типизация, промисы, отлавливаемые при компиляции ошибки и опечатки, автодополнения в коде, понятное поведение let вместо обескураживающего fuck-the-scope var.  Конечно, спустя время, я осознал, что спонсором большей части этого счастья является вовсе не TypeScript, а сам JavaScript, в его современной редакции (es6+). Но на тот момент казалось, что я нашел пророка, что приведет фронтенд к светлому, ~~коммунистическому~~ будущему. Добавьте к этому достаточно серьезный прогресс IDE в области Intellisense и помощи разработчику, и может быть, поймете мой щенячий восторг.

## Беспомощность
Первый серьезный удар поддых нанес мне сам TypeScript. Попытки прикрутить его к пустому проекту дали мне понять — я ничерта не смыслю за пределами angular и angular-cli, которые делают за меня кучу грязной работы. Мне нужен компилятор? Окей, прикручиваем его в package.json, делаем npm install, запускаем tsc и... ничего. Ах, его надо установить еще глобально? Опуская унылые подробности моей войны со всем этим добром, скажу, что некоторое время спустя я научился превращать main.ts в main.js. Но впереди меня ждала возня с webpack. 

Да, сейчас я осознаю, что можно было обойтись и без него. Но когда в неумелых руках Typescript, то все вокруг похоже на angular-cli. Это уже после внедрения webpack я узнаю, что и сам компилятор TypeScript умеет «следить» за изменениями в файлах, что проблему с import/export можно решить без webpack-а.

## Преодоление
Спустя примерно неделю я смог создать проект, в котором я писал TypeScript-код, нажимал «Сохранить» и все получалось так, как надо — webpack автоматически пересобирал все мои файлы в единый бандл, предварительно прогоняя по ним компилятор TypeScript, а затем загонял билд в отдельную папку, куда копировал прочие статические вещи, а в браузере в этот момент lite-server перезагружал страничку. Все происходило автомагически. Радости не было предела, и я сел писать простенький аренашутер.

С чего начинается ~~родина~~фреймворк для меня? Конечно, с базовых вещей, вроде математики векторов и матриц. Синдром Not Invented Here я успешно преодолел на работе, но в хобби он никуда не делся. Мне не хотелось готовых библиотек, поэтому я сел писать свою математику. Нет, это слишком громко сказано. Я открыл свой предыдущий фреймворк на FreePascal (https://github.com/perfectdaemon/tiny-glr/) и начал конвертить математику оттуда. Забегая вперед, скажу, что и в целом весь мой новый фреймворк является конвертаций старого из Free Pascal в TypeScript. Учитывая более чем трехлетний перерыв в геймдеве, я не мог придумать архитектуру лучше, или даже вспомнить, какие минусы были у прошлой.

Через некоторое время я начал выдыхаться: мотивация естественным образом снижалась, нагрузка на работе возрастала. А тут на igdc объявили очередной конкурс. Конкурс — это в первую очередь отличный внешний мотиватор, устанавливающий тематические, технические и временные ограничения.

Я уже говорил в прошлой своей статье, что такое igdc, но кратко повторюсь здесь — это такое теплое, ламповое сообщество, проводящее короткие или средней длины конкурсы по разработке игр на заданную тему. Без денежных призов, именитых спонсоров или гарантий трудоустройства. Ах да, еще без рекламы. И так уже почти 20 лет.

Тема конкурса - Garbage Game. Дан обширный и разнородный пак графических ресурсов. Задача участников — сделать игру, используя только его. Жанр и тема не ограничены, допускается использование любых звуков и музыки, так как в паке только графика. Есть техническое ограничение, связанное с запуском оффлайн без инсталляторов и прочего. Это является небольшой проблемой, ввиду того, что Chrome и компания много чего запрещают, когда пользователь открывает html-файл локально. WebGL может не включиться, скрипты не захотят подтягиваться, не говоря уже о графических ресурсах. Выход есть — делаем локальный супер маленький веб-сервер и скрипт запуска для пользователя, который его поднимет и откроет пользователю его любимый браузер по нужному адресу.

Задача несложная, я уложился в 6-килобайтный exe на C# и bat-ник рядом, определяющий папку с игрой, которую следует обслуживать и порт, по которому запускаться.