import { GuiButton } from '../../gui/gui-button';
import { GuiManager } from '../../gui/gui-manager';
import { TextureAtlas } from '../../render/texture-atlas';
import { ButtonData, MenuData } from './menu-data';

export class MenuHelper {
  public static loadMenu(gui: GuiManager, menuData: MenuData): void {
    menuData.buttons.forEach(element => {
      this.loadButton(gui, element);
    });
  }

  public static loadButton(gui: GuiManager, element: ButtonData): void {
    const button = new GuiButton();

    button.name = element.name;

    button.sprite.setSize(element.size.x, element.size.y);
    button.sprite.position.set(element.position);
    button.sprite.setVerticesColor(element.verticesColor);
    button.sprite.pivotPoint.set(element.pivotPoint);
    button.sprite.setDefaultVertices();

    button.label.color.set(element.labelColor);
    button.label.text = element.labelText;
    button.label.scale = element.labelScale;

    if (element.labelPosition != null) {
      button.label.position.set(element.labelPosition);
    }

    if (element.labelPivot != null) {
      button.label.pivotPoint.set(element.labelPivot);
    }

    if (element.textureRegion != null) {
      const textureAtlas = gui.material.textures[0].texture as TextureAtlas;
      if (textureAtlas != null) {
        const region = textureAtlas.getRegion(element.textureRegion.name);
        button.sprite.setTextureRegion(region, element.textureRegion.adjustSize);
      }
    }

    button.updateHitBox();

    button.onMouseOver = (el, ev) => (el as GuiButton).sprite.setVerticesColor(element.hoverVerticesColor);
    button.onMouseOut = (el, ev) => (el as GuiButton).sprite.setVerticesColor(element.verticesColor);

    gui.addElement(button);
  }
}
