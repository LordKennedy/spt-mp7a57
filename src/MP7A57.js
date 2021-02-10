class MP7A57
{
    constructor()
    {
        this.modname = "MP7A57";
        common_f.logger.logInfo(`Loading: ${this.modname}`);
        core_f.packager.onLoad[this.modname] = this.load.bind(this);
    }

    load()
    {
        // base
        const itemId = "020921_WEAPON_MP7A57";
        const itemClone = "5bd70322209c4d00d7167b8f";

        // handbook
        const itemCategory = "5b5f796a86f774093f2ed3c0";
        const itemFleaPrice = 67260;

        // item
        const itemPrefabPath = "MP7A57.bundle";
        const itemLongName = "MP7A57 5.7x28 submachinegun";
        const itemShortName = "MP7A57";
        const itemDescription = "A 5.7x28mm variant of the MP7A2 submachine gun.";

        // offer
        const itemTrader = "5935c25fb3acc3127c3d8cd9";
        const itemTraderPrice = 570;
        const itemTraderCurrency = "5696686a4bdc2da3298b456a";
        const itemTraderLV = 3;

        // pass info to functions bellow
        this.createItemHandbookEntry(itemId, itemCategory, itemFleaPrice);
        this.createItem(itemId, itemClone, itemPrefabPath, itemLongName, itemShortName, itemDescription);
        this.createItemOffer(itemId, itemTrader, itemTraderPrice, itemTraderCurrency, itemTraderLV);
    }

    createItemHandbookEntry(i_id, i_category, i_fprice)
    {
        // add item to handbook
        database_f.server.tables.templates.handbook.Items.push(
        {
            "Id": i_id,
            "ParentId": i_category,
            "Price": i_fprice,
        });
    }

    createItem(i_id, i_clone, i_path, i_lname, i_sname, i_desc)
    {
        let item = common_f.json.clone(database_f.server.tables.templates.items[i_clone]);

        // First we want to set up this weapon
        item._id = i_id;
        item._props.RecoilForceUp = 64;
        item._props.RecoilForceBack = 218;
        item._props.ammoCaliber = "Caliber57x28";

        // Make the chamber compatable with 5.7 ammo; copy the P90 chambers prop
        item._props.Chambers[0] = database_f.server.tables.templates.items["5cc82d76e24e8d00134b4b83"]._props.Chambers[0];
        // Update the parent to this item
        item._props.Chambers[0]._parent = i_id;

        // Now make the *gun* compatable with the 5.7 ammo; again, copy the P90 cartridges

        
        // add item back to database
        database_f.server.tables.templates.items[i_id] = item;

        // add custom item names to all languages/LOCALES
        for (const localeID in database_f.server.tables.locales.global)
        {
            database_f.server.tables.locales.global[localeID].templates[i_id] = {
                "Name": i_lname,
                "ShortName": i_sname,
                "Description": i_desc
            }
        }
        var fiveSevenCarts = database_f.server.tables.templates.items["5cc70093e4a949033c734312"]._props.Cartridges[0]._props.filters[0].Filter;
        // Next, we want to make the MP7 mags compatable with the 5.7mm ammo. We will just use the same magazines.
        // 40rd
        database_f.server.tables.templates.items["5ba26586d4351e44f824b340"]._props.Cartridges[0]._props.filters[0].Filter = database_f.server.tables.templates.items["5ba26586d4351e44f824b340"]._props.Cartridges[0]._props.filters[0].Filter.concat(fiveSevenCarts);
        // 30rd
        database_f.server.tables.templates.items["5ba2657ed4351e0035628ff2"]._props.Cartridges[0]._props.filters[0].Filter = database_f.server.tables.templates.items["5ba2657ed4351e0035628ff2"]._props.Cartridges[0]._props.filters[0].Filter.concat(fiveSevenCarts);
        // 20rd
        database_f.server.tables.templates.items["5ba264f6d4351e0034777d52"]._props.Cartridges[0]._props.filters[0].Filter = database_f.server.tables.templates.items["5ba264f6d4351e0034777d52"]._props.Cartridges[0]._props.filters[0].Filter.concat(fiveSevenCarts);

        // Next, disallow the 4.6x30 fh and allow the P90 FH and the Gemtech 5.7 suppressor
        var gemtechPt = database_f.server.tables.templates.items["5d3eb59ea4b9361c284bb4b2"]._props.Slots[0]._props.filters[0].Filter; // Copy the attachment options for the threaded Five-SeveN barrel
        var fiveSevenMuzzles = database_f.server.tables.templates.items["5cc701aae4a949000e1ea45c"]._props.Slots[0]._props.filters[0].Filter.concat(gemtechPt); // Append the muzzle attachment options for the P90 16" barrel to the Five-SeveN barrel attachments
        // Remove the 4.6mm fh
        item._props.Slots[1]._props.filters[0].Filter = item._props.Slots[1]._props.filters[0].Filter.filter(function(value, index, arr) {
            return value != "5ba26acdd4351e003562908e";
        });
        // Finally, add the fiveSevenMuzzles
        item._props.Slots[1]._props.filters[0].Filter = item._props.Slots[1]._props.filters[0].Filter.concat(fiveSevenMuzzles);

    }

    createItemOffer(i_id, i_trader, i_price, i_currency, i_loyalty)
    {
        // add item to trader
        database_f.server.tables.traders[i_trader].assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });
        // add trader cost to item
        database_f.server.tables.traders[i_trader].assort.barter_scheme[i_id] = [
            [
            {
                "count": i_price,
                "_tpl": i_currency
            }]
        ]
        // add trader loyalty level to item
        database_f.server.tables.traders[i_trader].assort.loyal_level_items[i_id] = i_loyalty;

        // add item stack to fleamarket
        database_f.server.tables.traders.ragfair.assort.items.push(
        {
            "_id": i_id,
            "_tpl": i_id,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });
        database_f.server.tables.traders.ragfair.assort.loyal_level_items[i_id] = 1;
    }
}

module.exports.MP7A57 = MP7A57;
