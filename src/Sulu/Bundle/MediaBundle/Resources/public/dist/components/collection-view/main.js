define(["config","services/sulumedia/user-settings-manager","sulusecurity/services/security-checker","services/sulumedia/file-icons","text!./skeleton.html"],function(a,b,c,d,e){"use strict";var f={childrenSelector:".children-container",toolbarSelector:".list-toolbar-container",datagridSelector:".datagrid-container",dropzoneSelector:".dropzone-container"};return{events:{names:{folderClicked:{postFix:"folder.clicked"},folderBreadcrumbClicked:{postFix:"folder.breadcrumb-clicked"},folderAddClicked:{postFix:"folder.add-clicked"},assetClicked:{postFix:"asset.clicked"},assetAdded:{postFix:"asset.added"},assetRemoved:{postFix:"asset.removed"},assetEditClicked:{postFix:"asset.edit-clicked"},assetDeleteClicked:{postFix:"asset.delete-clicked"},assetMoveClicked:{postFix:"asset.move-clicked"}},namespace:"sulu.collection-view."},defaults:{options:{data:null,dropzoneOverlayContainer:".content-column",assetActions:[],assetTypes:[],assetSelectOnClick:!1,assetSingleSelect:!1,assetShowActionIcon:!0,assetPreselected:[],assetHasEdit:!0,assetHasDelete:!0,assetHasMove:!0,assetHasSelectedCounter:!0,parentContainer:null},templates:{skeleton:e,childrenUrl:"/admin/api/collections<% if (!!collection) { %>/<%= collection %><% } %>?locale=<%= locale %>&sortBy=title<% if (!!collection) { %>&depth=1<% } %>",mediaUrl:"/admin/api/media?locale=<%= locale %><% if (!!types) { %>&types=<%= types %><%}%><% if (!!collection) { %>&collection=<%= collection %><% } %>",uploadUrl:"/admin/api/media?collection=<%= id %>&locale=<%= locale %>"}},initialize:function(){this.data=this.options.data,this.render(),this.bindDatagridEvents(),this.bindDropzoneEvents(),this.bindListToolbarEvents(),this.bindBreadcrumbEvents()},render:function(){var a,b;this.sandbox.dom.html(this.$el,this.templates.skeleton({title:this.data.title})),this.sandbox.start([{name:"breadcrumbs@suluadmin",options:{el:this.$el.find(".sulu-breadcrumb"),breadcrumbs:this.getBreadcrumb(),instanceName:this.options.instanceName}}]),a=this.startChildrenTiles(),b=this.startDatagrid(),$.when(a,b).done(function(){var a=this.$find(f.toolbarSelector).position().top-this.$find(f.toolbarSelector).height();this.sandbox.stickyToolbar.enable(this.$el,a)}.bind(this)),c.hasPermission(this.data,"add")&&this.startDropzone()},bindDatagridEvents:function(){this.sandbox.on("husky.datagrid."+this.data.id+".children.tiles.add-clicked",this.events.folderAddClicked),this.sandbox.on("husky.datagrid."+this.options.instanceName+".number.selections",function(a){var b=a>0?"enable":"disable",c="husky.toolbar."+this.options.instanceName+".item.";this.sandbox.emit(c+b,"media-move",!1),this.sandbox.emit(c+b,"editSelected",!1),this.sandbox.emit(c+b,"deleteSelected",!1)}.bind(this)),this.sandbox.on("sulu.list-toolbar.add",function(){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".show-popup")}.bind(this)),this.sandbox.on("husky.datagrid."+this.options.instanceName+".item.select",this.events.assetAdded),this.sandbox.on("husky.datagrid."+this.options.instanceName+".item.deselect",this.events.assetRemoved)},bindDropzoneEvents:function(){this.sandbox.on("husky.dropzone."+this.options.instanceName+".success",function(a,b){this.sandbox.emit("sulu.labels.success.show","labels.success.media-upload-desc","labels.success"),b.type=b.type.name,this.sandbox.emit("husky.datagrid."+this.options.instanceName+".records.add",[b])},this),this.sandbox.on("sulu.collection-add.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.collection-edit.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.collection-select.move-collection.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.collection-select.move-media.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.media-edit.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.permission-settings.initialized",this.disableDropzone.bind(this)),this.sandbox.on("sulu.collection-add.closed",this.enableDropzone.bind(this)),this.sandbox.on("sulu.collection-edit.closed",this.enableDropzone.bind(this)),this.sandbox.on("sulu.collection-select.move-collection.closed",this.enableDropzone.bind(this)),this.sandbox.on("sulu.collection-select.move-media.closed",this.enableDropzone.bind(this)),this.sandbox.on("sulu.media-edit.closed",this.enableDropzone.bind(this)),this.sandbox.on("sulu.permission-settings.closed",this.enableDropzone.bind(this))},bindListToolbarEvents:function(){var a="husky.datagrid."+this.options.instanceName+".change";this.sandbox.on("sulu.toolbar.change.table",function(){b.setMediaListView("table"),b.setMediaListPagination("dropdown"),this.sandbox.emit(a,1,b.getDropdownPageSize(),"table",[],"dropdown"),this.sandbox.stickyToolbar.reset(this.$el)}.bind(this)),this.sandbox.on("sulu.toolbar.change.masonry",function(){b.setMediaListView("datagrid/decorators/masonry-view"),b.setMediaListPagination("infinite-scroll"),this.sandbox.emit(a,1,b.getInfinityPageSize(),"datagrid/decorators/masonry-view",null,"infinite-scroll"),this.sandbox.stickyToolbar.reset(this.$el)}.bind(this))},bindBreadcrumbEvents:function(){this.sandbox.on("sulu.breadcrumbs."+this.options.instanceName+".breadcrumb-clicked",this.events.folderBreadcrumbClicked)},startChildrenTiles:function(){var a=$.Deferred();return this.data.hasSub?(this.sandbox.start([{name:"datagrid@husky",options:{el:this.$find(f.childrenSelector),url:this.templates.childrenUrl({collection:this.data.id,locale:this.options.locale}),instanceName:this.data.id+".children",view:"tiles",resultKey:"collections",viewOptions:{tiles:{fields:{description:["objectCount"]},translations:{addNew:"sulu.media.add-collection"}}},pagination:!1,actionCallback:function(a){this.events.folderClicked(a)}.bind(this),matchings:[{name:"id"},{name:"title"},{name:"objectCount",type:"count"}]}}]),this.sandbox.on("husky.datagrid."+this.data.id+".children.view.rendered",function(){a.resolve()}),a):(this.$find(f.childrenSelector).remove(),void a.resolve())},startDatagrid:function(){var a=$.Deferred(),c={"infinite-scroll":{reachedBottomMessage:"public.reached-list-end",scrollOffset:500}};return this.options.parentContainer&&(c["infinite-scroll"].scrollContainer=this.options.parentContainer),this.sandbox.sulu.initListToolbarAndList.call(this,"media","/admin/api/media/fields?locale="+this.options.locale+"&sortBy=created&sortOrder=desc",{el:this.$find(f.toolbarSelector),instanceName:this.options.instanceName,template:this.sandbox.sulu.buttons.get(this.getEditButtons())},{el:this.$find(f.datagridSelector),instanceName:this.options.instanceName,url:this.templates.mediaUrl({collection:this.data.id,locale:this.options.locale,types:this.options.assetTypes.join(",")}),searchFields:["name","title","description"],selectedCounter:this.options.assetHasSelectedCounter,view:b.getMediaListView(),pagination:b.getMediaListPagination(),resultKey:"media",preselected:this.options.assetPreselected,actionCallback:function(a,b){this.events.assetClicked(a,b)}.bind(this),viewOptions:{table:{actionIcon:this.options.assetShowActionIcon?this.options.assetSelectOnClick?"check":"pencil":null,actionIconColumn:this.options.assetSelectOnClick?null:"name",selectItem:this.options.assetSingleSelect?!1:{type:"checkbox",inFirstCell:!1},noImgIcon:function(a){return d.getByMimeType(a.mimeType)},badges:[{column:"title",callback:function(a,b){return a.locale!==this.options.locale?(b.title=a.locale,b):void 0}.bind(this)}]},"datagrid/decorators/masonry-view":{selectOnAction:!!this.options.assetSelectOnClick,selectable:!this.options.assetSingleSelect,unselectOnBackgroundClick:!1,noImgIcon:function(a){return d.getByMimeType(a.mimeType)},actionIcons:this.options.assetActions,locale:this.options.locale}},paginationOptions:c}),this.sandbox.on("husky.datagrid."+this.options.instanceName+".view.rendered",function(){a.resolve()}),a},startDropzone:function(){this.data.id&&this.sandbox.start([{name:"dropzone@husky",options:{el:this.$find(f.dropzoneSelector),maxFilesize:a.get("sulu-media").maxFilesize,url:this.templates.uploadUrl({id:this.data.id,locale:this.options.locale}),method:"POST",paramName:"fileVersion",overlayContainer:this.options.dropzoneOverlayContainer,instanceName:this.options.instanceName}}])},getEditButtons:function(){var a=[],b={};return this.data.id&&c.hasPermission(this.data,"add")&&(b.add={options:{showTitle:!0,title:"sulu-media.upload-files",icon:"cloud-upload",callback:function(){this.sandbox.emit("sulu.list-toolbar.add")}.bind(this)}}),this.options.assetHasEdit&&c.hasPermission(this.data,"edit")&&(b.editSelected={options:{callback:function(){this.sandbox.emit("husky.datagrid."+this.options.instanceName+".items.get-selected",this.events.assetEditClicked)}.bind(this)}}),this.options.assetHasDelete&&c.hasPermission(this.data,"delete")&&(b.deleteSelected={options:{callback:function(){this.sandbox.emit("husky.datagrid."+this.options.instanceName+".items.get-selected",this.events.assetDeleteClicked)}.bind(this)}}),this.options.assetHasMove&&this.data.id&&c.hasPermission(this.data,"edit")&&a.push({id:"media-move",title:this.sandbox.translate("sulu.media.move"),callback:function(){this.sandbox.emit("husky.datagrid."+this.options.instanceName+".items.get-selected",this.events.assetMoveClicked)}.bind(this)}),a.push({type:"columnOptions"}),b.settings={options:{dropdownItems:a}},b.mediaDecoratorDropdown={},b},getBreadcrumb:function(){if(!this.data.id)return[];var a=[{title:"sulu.media.all-collections",icon:"fa-folder",data:{}}];return this.data._embedded.breadcrumb.forEach(function(b){a.push({title:b.title,icon:"fa-folder",data:{id:b.id}})}.bind(this)),a},disableDropzone:function(){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".disable")},enableDropzone:function(){this.sandbox.emit("husky.dropzone."+this.options.instanceName+".enable")}}});