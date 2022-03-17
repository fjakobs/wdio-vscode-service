import { TreeSection } from "../TreeSection";
import { TreeItem } from "../../ViewItem";
import { ViewSectionLocators } from '../../ViewSection'
import { DefaultTreeItem } from "./DefaultTreeItem";

import { PluginDecorator, IPluginDecorator } from '../../../utils'
import { sideBar } from 'locators/1.61.0';

/**
 * Default view section
 */
export interface DefaultTreeSection extends IPluginDecorator<ViewSectionLocators> { }
@PluginDecorator(sideBar.DefaultTreeItem)
export class DefaultTreeSection extends TreeSection {
    async getVisibleItems(): Promise<TreeItem[]> {
        const items: TreeItem[] = [];
        const elements = await this.itemRow$$;
        for (const element of elements) {
            items.push(await new DefaultTreeItem(this.locatorMap.sideBar.DefaultTreeItem, element as any, this).wait());
        }
        return items;
    }

    async findItem(label: string, maxLevel: number = 0): Promise<TreeItem | undefined> {
        await this.expand();
        const container = await this.rowContainer$;
        await container.addValue(['Home']);
        let item: TreeItem | undefined = undefined;
        do {
            const temp = await container.$$(this.locatorMap.sideBar.DefaultTreeItem.ctor(label));
            if (temp.length > 0) {
                const level = +await temp[0].getAttribute(this.locators.level);
                if (maxLevel < 1 || level <= maxLevel) {
                    item = await new DefaultTreeItem(this.locatorMap.sideBar.DefaultTreeItem, temp[0] as any, this).wait();
                }
            } 
            if (!item) {
                const lastrow = await container.$$(this.locators.lastRow);
                if (lastrow.length > 0) {
                    break;
                }
                await container.addValue(['Page Down']);
            }
        } while (!item)

        return item;
    }
}