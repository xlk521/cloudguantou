/*
 * File: popcan/model/PortfolioModel.js
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

Ext.define('popcans.model.PortfolioModel', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'datetime',
            type: 'date'
        },
        {
            name: 'title',
            type: 'string'
        },
        {
            name: 'category',
            type: 'string'
        },
        {
            name: 'pid',
            type: 'string'
        },
        {
            name: 'owner',
            type: 'string'
        }
    ]
});