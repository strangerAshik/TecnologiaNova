

@section('latest_news_and_video')
<div id="dnn_MainLeftPane" class="fleft MainLeftPane">
   <div class="DnnModule DnnModule-ArticleCSDashboard DnnModule-848">
      <a name="848"></a>
      <div class="BHcontainerWS">
         <h2 class="Title"><span id="dnn_ctr848_dnnTitle_titleLabel" class="tt">Latest News</span>
         </h2>
         <div id="dnn_ctr848_ContentPane" class="containerpane">
            <!-- Start_Module_848 -->
            <div id="dnn_ctr848_ModuleContent" class="DNNModuleContent ModArticleCSDashboardC">
               <div class="da_LatestNew_Link" style="padding:7px,width:97%">
                  <ul class="da_LatestNew">
                     <li><a href='News/ArticleDisplay/tabid/223/Article/643350/a-look-back-at-desert-storm-25-years-later.html' class="da_news_link"> A look back at Desert Storm, 25 years later</a></li>
                     <li><a href='News/ArticleDisplay/tabid/223/Article/643334/secaf-speaks-at-csis-for-smart-women-smart-power-series.html' class="da_news_link"> SecAF speaks at CSIS for Smart Women, Smart Power series</a></li>
                     <li><a href='News/ArticleDisplay/tabid/223/Article/643299/acquisitions-enterprise-experimentation-and-agility.html' class="da_news_link"> Acquisitions enterprise: Experimentation and agility</a></li>
                     <li><a href='News/ArticleDisplay/tabid/223/Article/643260/af-week-in-photos.aspx' class="da_news_link"> AF Week in Photos</a></li>
                     <li><a href='News/ArticleDisplay/tabid/223/Article/643126/gulf-war-created-need-for-better-critical-care.html' class="da_news_link"> Gulf War created need for better critical care</a></li>
                  </ul>
               </div>
               <div style="text-align:right;width:100%">
                  <div style="float:right;padding:0px 5px 5px 0px">
                     <a target='_blank' href='DesktopModules/ArticleCS/RSS13be.ashx?ContentType=1&amp;Site=1&amp;Category=755&amp;max=20'><img title="RSS" src="Images/action_rss.gif" alt="RSS" style="border-width:0px;" /></a>
                  </div>
               </div>
            </div>
            <!-- End_Module_848 -->
         </div>
      </div>
   </div>
</div>

<div id="dnn_MainRightPane" class="fright MainRightPane">
   <div class="DnnModule DnnModule-VideoDashboard DnnModule-593">
      <a name="593"></a>
      <div class="BHcontainerWS">
         <h2 class="Title"><span id="dnn_ctr593_dnnTitle_titleLabel" class="tt">VIDEOS</span>
         </h2>
         <div id="dnn_ctr593_ContentPane" class="containerpane DNNAlignleft">
            <!-- Start_Module_593 -->
            <div id="dnn_ctr593_ModuleContent" class="DNNModuleContent ModVideoDashboardC">
               <input type="hidden" name="dnn$ctr593$View$hfTemplate" id="dnn_ctr593_View_hfTemplate" value="1" />
               <input type="hidden" name="dnn$ctr593$View$hfApiKey" id="dnn_ctr593_View_hfApiKey" value="key-51eea626518a3" />
               <input type="hidden" name="dnn$ctr593$View$hfTags" id="dnn_ctr593_View_hfTags" />
               <input type="hidden" name="dnn$ctr593$View$hfNumOfVids" id="dnn_ctr593_View_hfNumOfVids" value="3" />
               <input type="hidden" name="dnn$ctr593$View$hfVideoPage" id="dnn_ctr593_View_hfVideoPage" value="/News/AirForceTV.aspx" />
               <input type="hidden" name="dnn$ctr593$View$hfConfig" id="dnn_ctr593_View_hfConfig" value="true" />
               <input type="hidden" name="dnn$ctr593$View$hfCatList" id="dnn_ctr593_View_hfCatList" />
               <input type="hidden" name="dnn$ctr593$View$hfUnitName" id="dnn_ctr593_View_hfUnitName" value="Defense Media Activity - Air Force" />
               <input type="hidden" name="dnn$ctr593$View$hfAddThisID" id="dnn_ctr593_View_hfAddThisID" value="ra-51eec43576b71b48" />
               <script type="text/javascript">
               (function ($) {
               $(document).ready(function () {
               var template = $('#dnn_ctr593_View_hfTemplate').val();
               var api_key = $('#dnn_ctr593_View_hfApiKey').val();
               var NumOfVids = $('#dnn_ctr593_View_hfNumOfVids').val();
               var tags = $('#dnn_ctr593_View_hfTags').val();
               var mConfig = $('#dnn_ctr593_View_hfConfig').val();
               var videoPage = $('#dnn_ctr593_View_hfVideoPage').val();
               var catList = $('#dnn_ctr593_View_hfCatList').val();
               var UnitName = $('#dnn_ctr593_View_hfUnitName').val();
               var AddThisID = $('#dnn_ctr593_View_hfAddThisID').val();
               var vidDashboard = $("#vidDashboard");
               var vidDashContainerHeight = (template != "1") ? "100%;min-height:1px" : "191px";
               var vidRightInnerWidth = vidDashboard.parent().width() - 98;
               if (mConfig == "false") {
               $('#vidDashboard').append('<div class="dnnFormMessage dnnFormWarning">Please complete module settings to display video dashboard.</div>');
               }
               if (mConfig == "true") {
               var queryParameters;
               queryParameters = '';
               var videoItems;
               videoItems = '';
               var vidCount = 0;
               var vidID = '';
               if (tags != "") {
               queryParameters += '&' + tags;
               }
               if (catList != "") {
               queryParameters += '&' + catList;
               }
               if (UnitName.length > 0) {
               queryParameters += '&unit_name=' + UnitName;
               }
               var pathArray;
               var protocol;
               var host;
               var burl;
               pathArray = window.location.href.split('index.html');
               protocol = pathArray[0];
               host = pathArray[2];
               burl = protocol + '//' + host;
               $.getJSON("/desktopmodules/VideoDashboard/Handlers/vidHandler.ashx?NumOfVids=" + NumOfVids + queryParameters + '&api_key=' + api_key, function (dqresults) {
               if (dqresults.results != null) {
               videoItems += '<div class="vidDashContainer" style="height:' + vidDashContainerHeight + ';">';
               $.each(dqresults.results, function (index) {
               vidID = this.id;
               vidID = vidID.substr(6);
               if (template == "4") {
               videoItems += '<div class="vidOuterContainerJCS">';
               }
               else {
               videoItems += '<div class="vidOuterContainer">';
               }
               videoItems += '<div class="vidLeftInner">';
               videoItems += '<a href="' + videoPage + '?videoid=' + vidID + '" >';
               videoItems += '<div class="vidThumbnail"><img width="68px" height="38" src="' + this.thumbnail + '" alt="' + this.title + '" /></div>';
               videoItems += '</a>';
               videoItems += '</div>';
               videoItems += '<div class="vidRightInner" style="width: ' + vidRightInnerWidth + 'px;">';
               if (template == "4") {
               videoItems += '<a href="' + videoPage + '?videoid=' + vidID + '" class="vidAnchorJCS">';
               }
               else {
               videoItems += '<a href="' + videoPage + '?videoid=' + vidID + '">';
               }
               if (template == "4") {
               videoItems += '<div class="vidTitleContainer">';
               videoItems += '<div class="vidTitleJCS">' + this.title + '</div>';
               videoItems += '</div>';
               videoItems += '<div class="vidDescriptionContainer">';
               videoItems += '<div class="vidDescriptionJCS">' + this.short_description + '</div>';
               videoItems += '</div>';
               }
               else {
               videoItems += '<div class="vidTitle">' + this.title + '</div>';
               }
               videoItems += '</a>';
               if (template != "4") {
               videoItems += '<!-- AddThis Button BEGIN -->';
               videoItems += '<div class="addthis_toolbox addthis_default_style" addthis:url=\'' + burl + videoPage + '?videoid=' + vidID + '\' addthis:title=\'' + this.title + '\'>';
               videoItems += '<a class="addthis_button_email"></a>';
               videoItems += '<a class="addthis_button_facebook"></a>';
               videoItems += '<a class="addthis_button_twitter"></a>';
               videoItems += '
            </div>
            ';
            videoItems += '<script type="text/javascript">';
               videoItems += '    var addthis_config = {';
               videoItems += '        data_use_flash: false,';
               videoItems += '        data_use_cookies: false,';
               videoItems += '        ui_508_compliant: true';
               videoItems += '    }';
               videoItems += " <" + "/script>";
               videoItems += '<script type="text/javascript" src="http://s7.addthis.com/js/300/addthis_widget.js#pubid="' + AddThisID + '><' + '/script>';
               videoItems += '<!-- AddThis Button END -->';
               }
               videoItems += '
         </div>
         ';
         if (template == "4") {
         videoItems += '<div class="vidDividerJCS"><img src="/desktopmodules/VideoDashboard/Images/vidDivider.png" alt="Video Divider" /></div>';
         }
         videoItems += '<div style="clear:both;"></div>';
         videoItems += '
      </div>
      ';
      vidCount++;
      });
      if (template == "4") {
      videoItems += '<div class="vidFooterJCS">';
      videoItems += '<a href="http://www.dvidshub.net/rss/unit/2254" class="vidRSSJCS"></a>';
      videoItems += '<a href="' + videoPage + '" class="vidMoreLinkJCS">more&hellip;</a>';
      videoItems += '<div style="clear: both;"></div>';
      videoItems += '</div>';
      }
      videoItems += '
   </div>
   ';
   }
   if (vidCount > 0) {
   $('#vidDashboard').append(videoItems);
   }
   else {
   $('#vidDashboard').append('Sorry no videos available.');
   }
   // Chop title and description for JCS template
   if (template == "4") {
   var vidDivs = $("div.vidOuterContainerJCS");
   for (var i = 0; i < vidDivs.length - 2; i++) {
   textChopper(vidDivs.eq(i).find("div.vidTitleJCS"), vidDivs.eq(i).find("div.vidTitleContainer"));
   textChopper(vidDivs.eq(i).find("div.vidDescription"), vidDivs.eq(i).find("div.vidDescriptionContainer"));
   }
   }
   });
   } // close if
   // Shorten lengthy text
   function textChopper(innerObj, outerObj) {
   var originalText = "";
   originalText = innerObj.text();
   originalText = originalText.substr(0, 1000);
   while (innerObj.height() > outerObj.height()) {
   originalText = originalText.substr(0, originalText.length - 1);
   innerObj.text(originalText + "...");
   }
   }
   })
   })(jQuery);
   </script>
   <div id="vidDashboard"></div>
</div>
<!-- End_Module_593 --></div>
</div>
</div></div>
@stop

