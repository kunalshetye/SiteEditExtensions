// SiteEdit/Extensions/FieldBuilder/FieldBuilderControlsExtension.js

Type.registerNamespace("SiteEditExtensions");

SiteEditExtensions.PublishContent = function SiteEditExtensions$PublishContent() {
    console.log("PublishContent ctor was invokved.");
	Type.enableInterface(this, "PublishContent.Interface");
    this.addInterface("Tridion.Cme.Command", ["PublishContent"]);
};
 
SiteEditExtensions.PublishContent.prototype._isAvailable = function SiteEditExtensions$PublishContent$_isAvailable(selection)
{
	return true;
}
 
SiteEditExtensions.PublishContent.prototype._isEnabled = function SiteEditExtensions$PublishContent$_isEnabled(selection)
{
    return true;
}
 
SiteEditExtensions.PublishContent.prototype._execute = function SiteEditExtensions$PublishContent$_execute(selection,pipeline)
{
	view = window.$display.getView();
	if (view && view.openLibrary)
	{
		var library = view.getLibraryControl();
		var self = this;
		var libModeLabel, libLabel, libInfoLabel;
		var libSettings = {}, libOptions = {};

		function SiteEditExtensions$PublishContent$_execute$removeHandlers(e)
		{
			$evt.removeEventHandler(library, "changeitem", SiteEditExtensions$PublishContent$_execute$onChangeItem);
			$evt.removeEventHandler(view, "libraryclose", SiteEditExtensions$PublishContent$_execute$removeHandlers);
		};

		function SiteEditExtensions$PublishContent$_execute$onChangeItem(e)
		{

			var selection = library && library.getSelection();
			
			var newSelection = new Tridion.Cme.Selection();
			var item = selection.getItem(0);

			window.lastVisitedItem = item;

			newSelection.addItem(item);
			
			// Set Publish as allowed action to ensure that the Publish command is executed successfully.
			newSelection.properties.allowedActions = $const.AllowedActions.Publish;

			$commands.executeCommand("Publish",newSelection);
			
			view.closeLibrary();
		};

		function SiteEditExtensions$PublishContent$_execute$onLibraryOpenCallback()
		{

			libLabel = "Publish Component";
			libModeLabel = "Select the component to publish";
			libInfoLabel = '';

			view.setLibraryLabel(libLabel);
			view.setLibraryModeLabel(libModeLabel);
			view.setLibraryInfoLabel(libInfoLabel);
			view.setLibraryActionBtnsLabel('Publish');

			$evt.addEventHandler(library, "changeitem", SiteEditExtensions$PublishContent$_execute$onChangeItem);
			$evt.addEventHandler(view, "libraryclose", SiteEditExtensions$PublishContent$_execute$removeHandlers);

			if(window.lastVisitedItem == undefined || window.lastVisitedItem == '')
				window.lastVisitedItem = view.getPublicationId();

			switch($models.getItemType(window.lastVisitedItem))
			{
				case $const.ItemType.COMPONENT:
					view.navigateToLibraryItem(window.lastVisitedItem);
					break;
				default:
					view.navigateToLibraryItemRoot(window.lastVisitedItem);
					break;
			}
		};

		libOptions.allowSelectOrgItems = false;

		libSettings.conditions = {};
		libSettings.conditions.ItemTypes = [$const.ItemType.COMPONENT];

		view.openLibrary(
			Tridion.Web.UI.Editors.SiteEdit.Controls.SEDrillDown.Mode.SELECT,
			libOptions,
			libSettings, 
			true,
			SiteEditExtensions$PublishContent$_execute$onLibraryOpenCallback());
	}
}