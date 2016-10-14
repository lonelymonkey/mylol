<?php

?>
hello history.php

<div id="lol-history"></div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="lolHistoryData.js"></script>
<script type="text/javascript" src="lolHistoryUI.js"></script>

  <script type="text/javascript">
  /*
  $(document).ready(function(){


  });
  */
  $(document).ready(function(){
    lolHistoryUI.load({
      containerId : 'lol-history'
    });
  });
  </script>
