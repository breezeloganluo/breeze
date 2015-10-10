<div  id="modListMask"  class="modal fade in" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;padding-top:53px">
	<div class="modal-dialog" style="min-width:1200px">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true" onClick="var args=[];var app = FW.getAPP('data\\.configuration');app.FireEvent.closeAddNew.apply(app,args);">×</button>
				<h4 class="modal-title" id="H2">列表页按钮编辑</h4>
			</div>
			<div class="modal-body">
				<table class="table table-striped table-bordered table-hover dataTable no-footer" aria-describedby="dataTables-example_info">
					<thead>
						<tr role="row">
							<th style='width:60px;' class='center'>选择</th>
							<th>提示信息</th>
							<th>颜色</th>
							<th>图标</th>
							<th>当前行cid</th>
							<th>单击事件</th>
							<th>type值(可以为空)</th>
							<th>CMS权限名</th>
							<th>权限标识名</th>
							<th>事件节点</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td style='width:30px;' class='center'>
								<label>
									<input type='checkbox' name="rowCheckbox"/>
									<span class='lbl'></span>
								</label>
							</td>
							<td attr-d="title">
								<input class="form-control"></input>
							</td>
							<td attr-d="style">
								<select class="form-control">
									<option style="color:#428bca">btn-primary</option>
									<option style="color:#5cb85c">btn-success</option>
									<option style="color:#5bc0de">btn-info</option>
									<option style="color:#f0ad4e">btn-warning</option>
									<option style="color:#d9534f">btn-danger</option>
								</select>
							</td>
							<td attr-d="icon">
								<select class="form-control">
									<option>
										<li>
											<i class="icon-glass"></i> icon-glass
										</li>
									</option>
									<option>
										<li>
											<i class="icon-music"></i> icon-music
										</li>
									</option>
									<option>
										<li>
											<i class="icon-search"></i> icon-search
										</li>
									</option>
									<option>
	  									<li>
	    										<i class="icon-envelope-alt"></i> icon-envelope-alt
	  									</li>
									</option>
									<option>
										<li>
											<i class="icon-heart"></i> icon-heart
										</li>
									</option>
									<option>
										<li>
											<i class="icon-star"></i> icon-star
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-star-empty"></i> icon-star-empty
										</li>
									</option>
									<option>
										<li>
											<i class="icon-user"></i> icon-user
										</li>
									</option>
									<option>
										<li>
	    										<i class="icon-film"></i> icon-film
	  									</li>
									</option>
									<option>
	  									<li>
	    										<i class="icon-th-large"></i> icon-th-large
	  									</li>
									</option>
	  								<option>
										<li>
											<i class="icon-th"></i> icon-th
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-th-list"></i> icon-th-list
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok"></i> icon-ok
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove"></i> icon-remove
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-zoom-in"></i> icon-zoom-in
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-zoom-out"></i> icon-zoom-out
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-off"></i> icon-off
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signal"></i> icon-signal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cog"></i> icon-cog
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trash"></i> icon-trash
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-home"></i> icon-home
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-alt"></i> icon-file-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-time"></i> icon-time
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-road"></i> icon-road
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-download-alt"></i> icon-download-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-download"></i> icon-download
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-upload"></i> icon-upload
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-inbox"></i> icon-inbox
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play-circle"></i> icon-play-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-repeat"></i> icon-repeat
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-refresh"></i> icon-refresh
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-alt"></i> icon-list-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lock"></i> icon-lock
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag"></i> icon-flag
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-headphones"></i> icon-headphones
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-off"></i> icon-volume-off
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-down"></i> icon-volume-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-up"></i> icon-volume-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-qrcode"></i> icon-qrcode
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-barcode"></i> icon-barcode
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tag"></i> icon-tag
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tags"></i> icon-tags
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-book"></i> icon-book
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bookmark"></i> icon-bookmark
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-print"></i> icon-print
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-camera"></i> icon-camera
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-font"></i> icon-font
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bold"></i> icon-bold
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-italic"></i> icon-italic
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-text-height"></i> icon-text-height
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-text-width"></i> icon-text-width
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-left"></i> icon-align-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-center"></i> icon-align-center
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-right"></i> icon-align-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-justify"></i> icon-align-justify
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list"></i> icon-list
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-indent-left"></i> icon-indent-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-indent-right"></i> icon-indent-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facetime-video"></i> icon-facetime-video
										</li>
									</option>
	
	  								<option>
										<li>
											<i class="icon-picture"></i> icon-picture
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pencil"></i> icon-pencil
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-map-marker"></i> icon-map-marker
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-adjust"></i> icon-adjust
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tint"></i> icon-tint
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-edit"></i> icon-edit
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-share"></i> icon-share
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check"></i> icon-check
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-move"></i> icon-move
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-step-backward"></i> icon-step-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fast-backward"></i> icon-fast-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-backward"></i> icon-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play"></i> icon-play
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pause"></i> icon-pause
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stop"></i> icon-stop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-forward"></i> icon-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fast-forward"></i> icon-fast-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-step-forward"></i> icon-step-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eject"></i> icon-eject
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-left"></i> icon-chevron-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-right"></i> icon-chevron-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus-sign"></i> icon-plus-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus-sign"></i> icon-minus-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove-sign"></i> icon-remove-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok-sign"></i> icon-ok-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-question-sign"></i> icon-question-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-info-sign"></i> icon-info-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-screenshot"></i> icon-screenshot
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove-circle"></i> icon-remove-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok-circle"></i> icon-ok-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ban-circle"></i> icon-ban-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-left"></i> icon-arrow-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-right"></i> icon-arrow-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-up"></i> icon-arrow-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-down"></i> icon-arrow-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-share-alt"></i> icon-share-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-full"></i> icon-resize-full
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-small"></i> icon-resize-small
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus"></i> icon-plus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus"></i> icon-minus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-asterisk"></i> icon-asterisk
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exclamation-sign"></i> icon-exclamation-sign
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-gift"></i> icon-gift
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-leaf"></i> icon-leaf
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fire"></i> icon-fire
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eye-open"></i> icon-eye-open
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eye-close"></i> icon-eye-close
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-warning-sign"></i> icon-warning-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plane"></i> icon-plane
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-calendar"></i> icon-calendar
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-random"></i> icon-random
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comment"></i> icon-comment
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-magnet"></i> icon-magnet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-up"></i> icon-chevron-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-down"></i> icon-chevron-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-retweet"></i> icon-retweet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-shopping-cart"></i> icon-shopping-cart
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-close"></i> icon-folder-close
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-open"></i> icon-folder-open
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-vertical"></i> icon-resize-vertical
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-horizontal"></i> icon-resize-horizontal
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-bar-chart"></i> icon-bar-chart
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-twitter-sign"></i> icon-twitter-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facebook-sign"></i> icon-facebook-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-camera-retro"></i> icon-camera-retro
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-key"></i> icon-key
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cogs"></i> icon-cogs
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comments"></i> icon-comments
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-up-alt"></i> icon-thumbs-up-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-down-alt"></i> icon-thumbs-down-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-star-half"></i> icon-star-half
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-heart-empty"></i> icon-heart-empty
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signout"></i> icon-signout
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linkedin-sign"></i> icon-linkedin-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pushpin"></i> icon-pushpin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-external-link"></i> icon-external-link
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signin"></i> icon-signin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trophy"></i> icon-trophy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github-sign"></i> icon-github-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-upload-alt"></i> icon-upload-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lemon"></i> icon-lemon
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-phone"></i> icon-phone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-empty"></i> icon-check-empty
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bookmark-empty"></i> icon-bookmark-empty
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-phone-sign"></i> icon-phone-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-twitter"></i> icon-twitter
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facebook"></i> icon-facebook
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github"></i> icon-github
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlock"></i> icon-unlock
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-credit-card"></i> icon-credit-card
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-rss"></i> icon-rss
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hdd"></i> icon-hdd
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bullhorn"></i> icon-bullhorn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bell"></i> icon-bell
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-certificate"></i> icon-certificate
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-right"></i> icon-hand-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-left"></i> icon-hand-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-up"></i> icon-hand-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-down"></i> icon-hand-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-left"></i> icon-circle-arrow-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-right"></i> icon-circle-arrow-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-up"></i> icon-circle-arrow-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-down"></i> icon-circle-arrow-down
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-globe"></i> icon-globe
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-wrench"></i> icon-wrench
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tasks"></i> icon-tasks
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-filter"></i> icon-filter
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-briefcase"></i> icon-briefcase
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fullscreen"></i> icon-fullscreen
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-group"></i> icon-group
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-link"></i> icon-link
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cloud"></i> icon-cloud
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-beaker"></i> icon-beaker
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cut"></i> icon-cut
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-copy"></i> icon-copy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-paper-clip"></i> icon-paper-clip
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-save"></i> icon-save
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sign-blank"></i> icon-sign-blank
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reorder"></i> icon-reorder
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-ul"></i> icon-list-ul
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-ol"></i> icon-list-ol
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-strikethrough"></i> icon-strikethrough
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-underline"></i> icon-underline
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-table"></i> icon-table
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-magic"></i> icon-magic
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-truck"></i> icon-truck
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pinterest"></i> icon-pinterest
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pinterest-sign"></i> icon-pinterest-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-google-plus-sign"></i> icon-google-plus-sign
										</li>
									</option>
	
	  								<option>
										<li>
											<i class="icon-google-plus"></i> icon-google-plus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-money"></i> icon-money
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-down"></i> icon-caret-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-up"></i> icon-caret-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-left"></i> icon-caret-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-right"></i> icon-caret-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-columns"></i> icon-columns
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort"></i> icon-sort
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-down"></i> icon-sort-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-up"></i> icon-sort-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-envelope"></i> icon-envelope
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linkedin"></i> icon-linkedin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-undo"></i> icon-undo
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-legal"></i> icon-legal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dashboard"></i> icon-dashboard
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comment-alt"></i> icon-comment-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comments-alt"></i> icon-comments-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bolt"></i> icon-bolt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sitemap"></i> icon-sitemap
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-umbrella"></i> icon-umbrella
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-paste"></i> icon-paste
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lightbulb"></i> icon-lightbulb
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exchange"></i> icon-exchange
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cloud-download"></i> icon-cloud-download
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-cloud-upload"></i> icon-cloud-upload
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-user-md"></i> icon-user-md
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stethoscope"></i> icon-stethoscope
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-suitcase"></i> icon-suitcase
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bell-alt"></i> icon-bell-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-coffee"></i> icon-coffee
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-food"></i> icon-food
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-text-alt"></i> icon-file-text-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-building"></i> icon-building
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hospital"></i> icon-hospital
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ambulance"></i> icon-ambulance
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-medkit"></i> icon-medkit
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fighter-jet"></i> icon-fighter-jet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-beer"></i> icon-beer
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-h-sign"></i> icon-h-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus-sign-alt"></i> icon-plus-sign-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-double-angle-left"></i> icon-double-angle-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-right"></i> icon-double-angle-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-up"></i> icon-double-angle-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-down"></i> icon-double-angle-down
	  									</li>
	  								<option>
										<li>
											<i class="icon-angle-left"></i> icon-angle-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-right"></i> icon-angle-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-up"></i> icon-angle-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-down"></i> icon-angle-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-desktop"></i> icon-desktop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-laptop"></i> icon-laptop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tablet"></i> icon-tablet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-mobile-phone"></i> icon-mobile-phone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle-blank"></i> icon-circle-blank
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-quote-left"></i> icon-quote-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-quote-right"></i> icon-quote-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-spinner"></i> icon-spinner
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle"></i> icon-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reply"></i> icon-reply
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github-alt"></i> icon-github-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-close-alt"></i> icon-folder-close-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-folder-open-alt"></i> icon-folder-open-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-expand-alt"></i> icon-expand-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse-alt"></i> icon-collapse-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-smile"></i> icon-smile
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-frown"></i> icon-frown
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-meh"></i> icon-meh
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gamepad"></i> icon-gamepad
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-keyboard"></i> icon-keyboard
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag-alt"></i> icon-flag-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag-checkered"></i> icon-flag-checkered
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-terminal"></i> icon-terminal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-code"></i> icon-code
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reply-all"></i> icon-reply-all
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-mail-reply-all"></i> icon-mail-reply-all
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-star-half-empty"></i> icon-star-half-empty
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-location-arrow"></i> icon-location-arrow
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-crop"></i> icon-crop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-code-fork"></i> icon-code-fork
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlink"></i> icon-unlink
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-question"></i> icon-question
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-info"></i> icon-info
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exclamation"></i> icon-exclamation
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-superscript"></i> icon-superscript
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-subscript"></i> icon-subscript
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eraser"></i> icon-eraser
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-puzzle-piece"></i> icon-puzzle-piece
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-microphone"></i> icon-microphone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-microphone-off"></i> icon-microphone-off
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-shield"></i> icon-shield
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-calendar-empty"></i> icon-calendar-empty
										</li>	
	  								</option>
	  								<option>
										<li>
											<i class="icon-fire-extinguisher"></i> icon-fire-extinguisher
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-rocket"></i> icon-rocket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-maxcdn"></i> icon-maxcdn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-left"></i> icon-chevron-sign-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-right"></i> icon-chevron-sign-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-up"></i> icon-chevron-sign-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-down"></i> icon-chevron-sign-down
	  									</li>
	  								<option>
										<li>
											<i class="icon-html5"></i> icon-html5
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-css3"></i> icon-css3
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-anchor"></i> icon-anchor
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlock-alt"></i> icon-unlock-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bullseye"></i> icon-bullseye
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ellipsis-horizontal"></i> icon-ellipsis-horizontal
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-ellipsis-vertical"></i> icon-ellipsis-vertical
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-rss-sign"></i> icon-rss-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play-sign"></i> icon-play-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ticket"></i> icon-ticket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus-sign-alt"></i> icon-minus-sign-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-minus"></i> icon-check-minus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-level-up"></i> icon-level-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-level-down"></i> icon-level-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-sign"></i> icon-check-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-edit-sign"></i> icon-edit-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-external-link-sign"></i> icon-external-link-sign
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-share-sign"></i> icon-share-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-compass"></i> icon-compass
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse"></i> icon-collapse
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse-top"></i> icon-collapse-top
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-expand"></i> icon-expand
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eur"></i> icon-eur
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gbp"></i> icon-gbp
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-usd"></i> icon-usd
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-inr"></i> icon-inr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-jpy"></i> icon-jpy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cny"></i> icon-cny
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-krw"></i> icon-krw
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-btc"></i> icon-btc
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file"></i> icon-file
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-text"></i> icon-file-text
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-by-alphabet"></i> icon-sort-by-alphabet
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-sort-by-alphabet-alt"></i> icon-sort-by-alphabet-alt
	  									</li>
	  								<option>
										<li>
											<i class="icon-sort-by-attributes"></i> icon-sort-by-attributes
										</li>	
	  								</option>
	  								<option>
										<li>
											<i class="icon-sort-by-attributes-alt"></i> icon-sort-by-attributes-alt
	  									</li>
	  								<option>
										<li>
											<i class="icon-sort-by-order"></i> icon-sort-by-order
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-by-order-alt"></i> icon-sort-by-order-alt
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-thumbs-up"></i> icon-thumbs-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-down"></i> icon-thumbs-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube-sign"></i> icon-youtube-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube"></i> icon-youtube
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-xing"></i> icon-xing
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-xing-sign"></i> icon-xing-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube-play"></i> icon-youtube-play
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dropbox"></i> icon-dropbox
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stackexchange"></i> icon-stackexchange
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-instagram"></i> icon-instagram
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flickr"></i> icon-flickr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-adn"></i> icon-adn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bitbucket"></i> icon-bitbucket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bitbucket-sign"></i> icon-bitbucket-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tumblr"></i> icon-tumblr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tumblr-sign"></i> icon-tumblr-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-down"></i> icon-long-arrow-down
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-up"></i> icon-long-arrow-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-left"></i> icon-long-arrow-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-right"></i> icon-long-arrow-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-apple"></i> icon-apple
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-windows"></i> icon-windows
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-android"></i> icon-android
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linux"></i> icon-linux
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dribbble"></i> icon-dribbble
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-skype"></i> icon-skype
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-foursquare"></i> icon-foursquare
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trello"></i> icon-trello
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-female"></i> icon-female
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-male"></i> icon-male
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gittip"></i> icon-gittip
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sun"></i> icon-sun
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-moon"></i> icon-moon
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-archive"></i> icon-archive
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bug"></i> icon-bug
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-vk"></i> icon-vk
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-weibo"></i> icon-weibo
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-renren"></i> icon-renren
										</li>
									</option>
								</select>								
							</td>
							<td attr-d="rowId">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
							<td attr-d="fun">
								<input class="form-control"></input>
							</td>
							<td attr-d="type">
								<input class="form-control"></input>
							</td>
							<td attr-d="authority">
								<input class="form-control"></input>
							</td>
							<td attr-d="actionKey">
								<input class="form-control"></input>
							</td>
							<td attr-d="dom">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
						</tr>
						<tr class="list-tr-hidden" style="display:none">
							<td style='width:30px;' class='center'>
								<label>
									<input type='checkbox' name="rowCheckbox"/>
									<span class='lbl'></span>
								</label>
							</td>
							<td attr-d="title">
								<input class="form-control"></input>
							</td>
							<td attr-d="style">
								<select class="form-control">
									<option style="color:#428bca">btn-primary</option>
									<option style="color:#5cb85c">btn-success</option>
									<option style="color:#5bc0de">btn-info</option>
									<option style="color:#f0ad4e">btn-warning</option>
									<option style="color:#d9534f">btn-danger</option>
								</select>
							</td>
							<td attr-d="icon">
								<select class="form-control">
									<option>
										<li>
											<i class="icon-glass"></i> icon-glass
										</li>
									</option>
									<option>
										<li>
											<i class="icon-music"></i> icon-music
										</li>
									</option>
									<option>
										<li>
											<i class="icon-search"></i> icon-search
										</li>
									</option>
									<option>
	  									<li>
	    										<i class="icon-envelope-alt"></i> icon-envelope-alt
	  									</li>
									</option>
									<option>
										<li>
											<i class="icon-heart"></i> icon-heart
										</li>
									</option>
									<option>
										<li>
											<i class="icon-star"></i> icon-star
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-star-empty"></i> icon-star-empty
										</li>
									</option>
									<option>
										<li>
											<i class="icon-user"></i> icon-user
										</li>
									</option>
									<option>
										<li>
	    										<i class="icon-film"></i> icon-film
	  									</li>
									</option>
									<option>
	  									<li>
	    										<i class="icon-th-large"></i> icon-th-large
	  									</li>
									</option>
	  								<option>
										<li>
											<i class="icon-th"></i> icon-th
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-th-list"></i> icon-th-list
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok"></i> icon-ok
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove"></i> icon-remove
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-zoom-in"></i> icon-zoom-in
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-zoom-out"></i> icon-zoom-out
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-off"></i> icon-off
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signal"></i> icon-signal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cog"></i> icon-cog
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trash"></i> icon-trash
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-home"></i> icon-home
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-alt"></i> icon-file-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-time"></i> icon-time
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-road"></i> icon-road
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-download-alt"></i> icon-download-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-download"></i> icon-download
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-upload"></i> icon-upload
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-inbox"></i> icon-inbox
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play-circle"></i> icon-play-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-repeat"></i> icon-repeat
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-refresh"></i> icon-refresh
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-alt"></i> icon-list-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lock"></i> icon-lock
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag"></i> icon-flag
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-headphones"></i> icon-headphones
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-off"></i> icon-volume-off
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-down"></i> icon-volume-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-volume-up"></i> icon-volume-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-qrcode"></i> icon-qrcode
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-barcode"></i> icon-barcode
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tag"></i> icon-tag
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tags"></i> icon-tags
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-book"></i> icon-book
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bookmark"></i> icon-bookmark
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-print"></i> icon-print
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-camera"></i> icon-camera
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-font"></i> icon-font
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bold"></i> icon-bold
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-italic"></i> icon-italic
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-text-height"></i> icon-text-height
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-text-width"></i> icon-text-width
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-left"></i> icon-align-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-center"></i> icon-align-center
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-right"></i> icon-align-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-align-justify"></i> icon-align-justify
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list"></i> icon-list
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-indent-left"></i> icon-indent-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-indent-right"></i> icon-indent-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facetime-video"></i> icon-facetime-video
										</li>
									</option>
	
	  								<option>
										<li>
											<i class="icon-picture"></i> icon-picture
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pencil"></i> icon-pencil
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-map-marker"></i> icon-map-marker
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-adjust"></i> icon-adjust
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tint"></i> icon-tint
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-edit"></i> icon-edit
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-share"></i> icon-share
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check"></i> icon-check
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-move"></i> icon-move
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-step-backward"></i> icon-step-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fast-backward"></i> icon-fast-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-backward"></i> icon-backward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play"></i> icon-play
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pause"></i> icon-pause
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stop"></i> icon-stop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-forward"></i> icon-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fast-forward"></i> icon-fast-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-step-forward"></i> icon-step-forward
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eject"></i> icon-eject
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-left"></i> icon-chevron-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-right"></i> icon-chevron-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus-sign"></i> icon-plus-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus-sign"></i> icon-minus-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove-sign"></i> icon-remove-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok-sign"></i> icon-ok-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-question-sign"></i> icon-question-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-info-sign"></i> icon-info-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-screenshot"></i> icon-screenshot
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-remove-circle"></i> icon-remove-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ok-circle"></i> icon-ok-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ban-circle"></i> icon-ban-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-left"></i> icon-arrow-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-right"></i> icon-arrow-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-up"></i> icon-arrow-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-arrow-down"></i> icon-arrow-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-share-alt"></i> icon-share-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-full"></i> icon-resize-full
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-small"></i> icon-resize-small
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus"></i> icon-plus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus"></i> icon-minus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-asterisk"></i> icon-asterisk
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exclamation-sign"></i> icon-exclamation-sign
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-gift"></i> icon-gift
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-leaf"></i> icon-leaf
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fire"></i> icon-fire
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eye-open"></i> icon-eye-open
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eye-close"></i> icon-eye-close
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-warning-sign"></i> icon-warning-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plane"></i> icon-plane
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-calendar"></i> icon-calendar
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-random"></i> icon-random
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comment"></i> icon-comment
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-magnet"></i> icon-magnet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-up"></i> icon-chevron-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-down"></i> icon-chevron-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-retweet"></i> icon-retweet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-shopping-cart"></i> icon-shopping-cart
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-close"></i> icon-folder-close
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-open"></i> icon-folder-open
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-vertical"></i> icon-resize-vertical
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-resize-horizontal"></i> icon-resize-horizontal
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-bar-chart"></i> icon-bar-chart
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-twitter-sign"></i> icon-twitter-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facebook-sign"></i> icon-facebook-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-camera-retro"></i> icon-camera-retro
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-key"></i> icon-key
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cogs"></i> icon-cogs
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comments"></i> icon-comments
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-up-alt"></i> icon-thumbs-up-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-down-alt"></i> icon-thumbs-down-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-star-half"></i> icon-star-half
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-heart-empty"></i> icon-heart-empty
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signout"></i> icon-signout
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linkedin-sign"></i> icon-linkedin-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pushpin"></i> icon-pushpin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-external-link"></i> icon-external-link
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-signin"></i> icon-signin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trophy"></i> icon-trophy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github-sign"></i> icon-github-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-upload-alt"></i> icon-upload-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lemon"></i> icon-lemon
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-phone"></i> icon-phone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-empty"></i> icon-check-empty
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bookmark-empty"></i> icon-bookmark-empty
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-phone-sign"></i> icon-phone-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-twitter"></i> icon-twitter
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-facebook"></i> icon-facebook
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github"></i> icon-github
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlock"></i> icon-unlock
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-credit-card"></i> icon-credit-card
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-rss"></i> icon-rss
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hdd"></i> icon-hdd
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bullhorn"></i> icon-bullhorn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bell"></i> icon-bell
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-certificate"></i> icon-certificate
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-right"></i> icon-hand-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-left"></i> icon-hand-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-up"></i> icon-hand-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hand-down"></i> icon-hand-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-left"></i> icon-circle-arrow-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-right"></i> icon-circle-arrow-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-up"></i> icon-circle-arrow-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-circle-arrow-down"></i> icon-circle-arrow-down
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-globe"></i> icon-globe
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-wrench"></i> icon-wrench
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tasks"></i> icon-tasks
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-filter"></i> icon-filter
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-briefcase"></i> icon-briefcase
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fullscreen"></i> icon-fullscreen
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-group"></i> icon-group
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-link"></i> icon-link
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cloud"></i> icon-cloud
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-beaker"></i> icon-beaker
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cut"></i> icon-cut
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-copy"></i> icon-copy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-paper-clip"></i> icon-paper-clip
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-save"></i> icon-save
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sign-blank"></i> icon-sign-blank
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reorder"></i> icon-reorder
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-ul"></i> icon-list-ul
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-list-ol"></i> icon-list-ol
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-strikethrough"></i> icon-strikethrough
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-underline"></i> icon-underline
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-table"></i> icon-table
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-magic"></i> icon-magic
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-truck"></i> icon-truck
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pinterest"></i> icon-pinterest
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-pinterest-sign"></i> icon-pinterest-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-google-plus-sign"></i> icon-google-plus-sign
										</li>
									</option>
	
	  								<option>
										<li>
											<i class="icon-google-plus"></i> icon-google-plus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-money"></i> icon-money
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-down"></i> icon-caret-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-up"></i> icon-caret-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-left"></i> icon-caret-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-caret-right"></i> icon-caret-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-columns"></i> icon-columns
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort"></i> icon-sort
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-down"></i> icon-sort-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-up"></i> icon-sort-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-envelope"></i> icon-envelope
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linkedin"></i> icon-linkedin
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-undo"></i> icon-undo
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-legal"></i> icon-legal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dashboard"></i> icon-dashboard
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comment-alt"></i> icon-comment-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-comments-alt"></i> icon-comments-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bolt"></i> icon-bolt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sitemap"></i> icon-sitemap
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-umbrella"></i> icon-umbrella
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-paste"></i> icon-paste
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-lightbulb"></i> icon-lightbulb
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exchange"></i> icon-exchange
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cloud-download"></i> icon-cloud-download
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-cloud-upload"></i> icon-cloud-upload
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-user-md"></i> icon-user-md
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stethoscope"></i> icon-stethoscope
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-suitcase"></i> icon-suitcase
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bell-alt"></i> icon-bell-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-coffee"></i> icon-coffee
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-food"></i> icon-food
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-text-alt"></i> icon-file-text-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-building"></i> icon-building
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-hospital"></i> icon-hospital
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ambulance"></i> icon-ambulance
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-medkit"></i> icon-medkit
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-fighter-jet"></i> icon-fighter-jet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-beer"></i> icon-beer
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-h-sign"></i> icon-h-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-plus-sign-alt"></i> icon-plus-sign-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-double-angle-left"></i> icon-double-angle-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-right"></i> icon-double-angle-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-up"></i> icon-double-angle-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-double-angle-down"></i> icon-double-angle-down
	  									</li>
	  								<option>
										<li>
											<i class="icon-angle-left"></i> icon-angle-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-right"></i> icon-angle-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-up"></i> icon-angle-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-angle-down"></i> icon-angle-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-desktop"></i> icon-desktop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-laptop"></i> icon-laptop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tablet"></i> icon-tablet
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-mobile-phone"></i> icon-mobile-phone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle-blank"></i> icon-circle-blank
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-quote-left"></i> icon-quote-left
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-quote-right"></i> icon-quote-right
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-spinner"></i> icon-spinner
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-circle"></i> icon-circle
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reply"></i> icon-reply
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-github-alt"></i> icon-github-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-folder-close-alt"></i> icon-folder-close-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-folder-open-alt"></i> icon-folder-open-alt
										</li>
	  								</option>
	
	  								<option>
										<li>
											<i class="icon-expand-alt"></i> icon-expand-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse-alt"></i> icon-collapse-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-smile"></i> icon-smile
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-frown"></i> icon-frown
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-meh"></i> icon-meh
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gamepad"></i> icon-gamepad
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-keyboard"></i> icon-keyboard
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag-alt"></i> icon-flag-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flag-checkered"></i> icon-flag-checkered
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-terminal"></i> icon-terminal
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-code"></i> icon-code
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-reply-all"></i> icon-reply-all
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-mail-reply-all"></i> icon-mail-reply-all
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-star-half-empty"></i> icon-star-half-empty
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-location-arrow"></i> icon-location-arrow
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-crop"></i> icon-crop
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-code-fork"></i> icon-code-fork
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlink"></i> icon-unlink
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-question"></i> icon-question
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-info"></i> icon-info
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-exclamation"></i> icon-exclamation
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-superscript"></i> icon-superscript
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-subscript"></i> icon-subscript
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eraser"></i> icon-eraser
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-puzzle-piece"></i> icon-puzzle-piece
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-microphone"></i> icon-microphone
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-microphone-off"></i> icon-microphone-off
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-shield"></i> icon-shield
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-calendar-empty"></i> icon-calendar-empty
										</li>	
	  								</option>
	  								<option>
										<li>
											<i class="icon-fire-extinguisher"></i> icon-fire-extinguisher
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-rocket"></i> icon-rocket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-maxcdn"></i> icon-maxcdn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-left"></i> icon-chevron-sign-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-right"></i> icon-chevron-sign-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-up"></i> icon-chevron-sign-up
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-chevron-sign-down"></i> icon-chevron-sign-down
	  									</li>
	  								<option>
										<li>
											<i class="icon-html5"></i> icon-html5
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-css3"></i> icon-css3
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-anchor"></i> icon-anchor
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-unlock-alt"></i> icon-unlock-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bullseye"></i> icon-bullseye
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ellipsis-horizontal"></i> icon-ellipsis-horizontal
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-ellipsis-vertical"></i> icon-ellipsis-vertical
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-rss-sign"></i> icon-rss-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-play-sign"></i> icon-play-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-ticket"></i> icon-ticket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-minus-sign-alt"></i> icon-minus-sign-alt
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-minus"></i> icon-check-minus
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-level-up"></i> icon-level-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-level-down"></i> icon-level-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-check-sign"></i> icon-check-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-edit-sign"></i> icon-edit-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-external-link-sign"></i> icon-external-link-sign
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-share-sign"></i> icon-share-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-compass"></i> icon-compass
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse"></i> icon-collapse
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-collapse-top"></i> icon-collapse-top
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-expand"></i> icon-expand
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-eur"></i> icon-eur
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gbp"></i> icon-gbp
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-usd"></i> icon-usd
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-inr"></i> icon-inr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-jpy"></i> icon-jpy
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-cny"></i> icon-cny
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-krw"></i> icon-krw
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-btc"></i> icon-btc
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file"></i> icon-file
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-file-text"></i> icon-file-text
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-by-alphabet"></i> icon-sort-by-alphabet
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-sort-by-alphabet-alt"></i> icon-sort-by-alphabet-alt
	  									</li>
	  								<option>
										<li>
											<i class="icon-sort-by-attributes"></i> icon-sort-by-attributes
										</li>	
	  								</option>
	  								<option>
										<li>
											<i class="icon-sort-by-attributes-alt"></i> icon-sort-by-attributes-alt
	  									</li>
	  								<option>
										<li>
											<i class="icon-sort-by-order"></i> icon-sort-by-order
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sort-by-order-alt"></i> icon-sort-by-order-alt
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-thumbs-up"></i> icon-thumbs-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-thumbs-down"></i> icon-thumbs-down
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube-sign"></i> icon-youtube-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube"></i> icon-youtube
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-xing"></i> icon-xing
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-xing-sign"></i> icon-xing-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-youtube-play"></i> icon-youtube-play
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dropbox"></i> icon-dropbox
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-stackexchange"></i> icon-stackexchange
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-instagram"></i> icon-instagram
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-flickr"></i> icon-flickr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-adn"></i> icon-adn
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bitbucket"></i> icon-bitbucket
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bitbucket-sign"></i> icon-bitbucket-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tumblr"></i> icon-tumblr
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-tumblr-sign"></i> icon-tumblr-sign
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-down"></i> icon-long-arrow-down
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-up"></i> icon-long-arrow-up
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-left"></i> icon-long-arrow-left
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-long-arrow-right"></i> icon-long-arrow-right
										</li>
	  								</option>
	  								<option>
										<li>
											<i class="icon-apple"></i> icon-apple
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-windows"></i> icon-windows
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-android"></i> icon-android
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-linux"></i> icon-linux
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-dribbble"></i> icon-dribbble
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-skype"></i> icon-skype
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-foursquare"></i> icon-foursquare
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-trello"></i> icon-trello
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-female"></i> icon-female
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-male"></i> icon-male
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-gittip"></i> icon-gittip
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-sun"></i> icon-sun
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-moon"></i> icon-moon
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-archive"></i> icon-archive
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-bug"></i> icon-bug
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-vk"></i> icon-vk
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-weibo"></i> icon-weibo
										</li>
									</option>
	  								<option>
										<li>
											<i class="icon-renren"></i> icon-renren
										</li>
									</option>
								</select>								
							</td>
							<td attr-d="rowId">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
							<td attr-d="fun">
								<input class="form-control"></input>
							</td>
							<td attr-d="type">
								<input class="form-control"></input>
							</td>
							<td attr-d="authority">
								<input class="form-control"></input>
							</td>
							<td attr-d="actionKey">
								<input class="form-control"></input>
							</td>
							<td attr-d="dom">
								<select class="form-control">
									<option>true</option>
									<option>false</option>
								</select>
							</td>
						</tr>
					</tbody>
				</table>
				<div style="width:220px;" class="hidden-phone visible-desktop btn-group pull-left">
					<button type="button" class="btn btn-xs btn-success btn-add-con" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectAdd.apply(app,args);">
						<i class="icon-plus bigger-120"> 增加</i>
					</button>
					<button type="button" class="btn btn-xs btn-info btn-sel-all" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectAll.apply(app,args);">
						<i class="icon-ok bigger-120"> 全选</i>
					</button>
					<button type="button" class="btn btn-xs btn-warning btn-sel-oppo" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectChange.apply(app,args);">
						<i class="icon-remove bigger-120"> 反选</i>
					</button>
					<button type="button" class="btn btn-xs btn-danger btn-del" onClick="var args=[this];var app = FW.getAPP('data\\.configuration');app.FireEvent.selectDelete.apply(app,args);">
						<i class="icon-trash bigger-120"> 删除</i>
					</button>
				</div>
			</div>
			<div class="modal-footer">
				<input type="button" class="btn btn-success btn-lg btn-rect" value="确认提交" title="确认提交" onClick="var args=['listOperBtns'];var app = FW.getAPP('data\\.configuration');app.FireEvent.saveAddNew.apply(app,args);">
				<input type="button" class="btn btn-primary btn-lg btn-rect" value="取消编辑" title="取消编辑"  onClick="var args=[];var app = FW.getAPP('data\\.configuration');app.FireEvent.closeAddNew.apply(app,args);">
            			</div>
        		</div>
    	</div>
</div>