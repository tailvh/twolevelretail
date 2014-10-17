<html lang="en" style="min-height:1000px;" ><head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="img/logos/mulle.png">

    <title>Off Canvas Template for Bootstrap</title>

    <!-- Custom styles for this template -->
    <!--<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400&amp;subset=latin,latin-ext,cyrillic,greek,vietnamese" rel="stylesheet" type="text/css">-->
        <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">    
    <link href="assets/css/animation.css" rel="stylesheet">
    <!--<link href="assets/css/animation-set.css" rel="stylesheet">-->
    <link href="assets/css/ng-table.css" rel="stylesheet">
    <link href="assets/css/loading-bar.min.css" rel="stylesheet">
    <link href="<?= asset('/js/bower_components') ?>/angular-text/font-awesome-4.0.3/css/font-awesome.css" rel="stylesheet">
    <link href="<?= asset('/js/bower_components') ?>/angular-treeview/css/angular.treeview.css" rel="stylesheet">
    <link href="<?= asset('/js/bower_components') ?>/angular-carousel/angular-carousel.css" rel="stylesheet">
    <link href="assets/css/offcanvas.css" rel="stylesheet">
    <link rel="stylesheet" media="screen and (max-width: 770px)" type="text/css" href="assets/css/phoneoffcanvas.css" />
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
    <title ng-bind="$state.current.name + ' - ui-router'">ui-router</title>
  </head>

  <body>
    <div ui-view class="ngPartialSlideReveal" autoscroll="false">
    </div>   
  </body>
  <script src="<?= asset('/js/bower_components') ?>/tweenmax/TweenMax.min.js"></script>
  <script type="text/javascript" src="https://www.google.com/jsapi"></script>
  <script src="<?= asset('/js/bower_components') ?>/angular-upload/angular-file-upload-shim.min.js"></script> 
  <script src="<?= asset('/js/bower_components/requirejs/require.js') ?>" data-main="<?= asset('/js/main' . (App::environment('staging', 'production') ? '' : '') . '.min.js') ?>"></script>
  
  <!-- online resource -->
  <script src="//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
  <div style="display:none" id="token"><?php echo csrf_token(); ?></div>
<!--<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
  Launch demo modal
</button>-->
</html>