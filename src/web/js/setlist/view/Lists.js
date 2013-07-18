Ext.define('setlist.view.Lists',{
    extend : 'Ext.view.View',
    cls : 'setlist-lists',
    itemCls : 'list-item',
    itemSelector : '.list-item',
    itemTpl : '{name}',
    overItemCls:'over',
    initComponent : function(){
        var me = this;

        me.store = Ext.create('setlist.store.ListStore');

        me.callParent(arguments);
    }
});