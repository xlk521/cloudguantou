/*
 * File: popcan/view/BaseViewport.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('popcans.view.BaseViewport', {
    extend: 'Ext.container.Viewport',

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'toolbar',
                    region: 'north',
                    height: 50,
                    items: [
                        {
                            xtype: 'tbtext',
                            text: '6Cans后台管理系统'
                        }
                    ]
                },
                {
                    xtype: 'tabpanel',
                    region: 'center',
                    suspendLayout: true,
                    activeTab: 1,
                    items: [
                        {
                            xtype: 'panel',
                            title: '首页'
                        },
                        {
                            xtype: 'panel',
                            layout: {
                                type: 'fit'
                            },
                            title: '作品审核',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        align: 'stretch',
                                        type: 'hbox'
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            flex: 1,
                                            layout: {
                                                align: 'stretch',
                                                type: 'vbox'
                                            },
                                            items: [
                                                {
                                                    xtype: 'gridpanel',
                                                    flex: 1,
                                                    id: 'WaitingAuditPortfoiloGrid',
                                                    itemId: 'WaitingAuditPortfoiloGrid',
                                                    title: '待审核作品',
                                                    store: 'PortfolioStore',
                                                    columns: [
                                                        {
                                                            xtype: 'gridcolumn',
                                                            hidden: true,
                                                            dataIndex: 'pid',
                                                            text: '作品集'
                                                        },
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'datetime',
                                                            text: '提交时间'
                                                        },
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'owner',
                                                            text: '提交用户'
                                                        },
                                                        {
                                                            xtype: 'gridcolumn',
                                                            dataIndex: 'title',
                                                            text: '作品名称'
                                                        }
                                                    ],
                                                    viewConfig: {

                                                    },
                                                    listeners: {
                                                        activate: {
                                                            fn: me.onGridpanelActivate,
                                                            scope: me
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'container',
                                            flex: 2,
                                            padding: 2,
                                            items: [
                                                {
                                                    xtype: 'fieldset',
                                                    title: '作者信息'
                                                },
                                                {
                                                    xtype: 'fieldset',
                                                    title: '作品信息'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            title: '订单处理'
                        },
                        {
                            xtype: 'panel',
                            title: '属性调整'
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    },

    onGridpanelActivate: function(abstractcomponent, options) {
        console.log(abstractcomponent.store);
        abstractcomponent.store.load({
            params: {
                page: 1
            }
        });
    }

});