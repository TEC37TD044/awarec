import { db } from "../../providers/firebase";
import React, { useState, useEffect } from "react";
import { ListAlt, SettingsApplications } from "@material-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import { useForm } from "../../hooks/useForm";
import { FormAsset } from "./FormAsset";
import CustomTabs from "components/CustomTabs/CustomTabs";
import { AssetsSettings } from "./AssetsSettings";
import Button from "components/CustomButtons/Button.js";

export default function UpdateAsset() {
  const location = useLocation();
  const history = useHistory();
  const [item, setItem] = useState([]);

  const {
    register,
    handleSubmit,
    errors,
    values,
    handleInputChange,
    handleChangeChecked,
  } = useForm({
    name: location.state.detail.name,
    description: location.state.detail.description,
    make: location.state.detail.make,
    model: location.state.detail.model,
    serie: location.state.detail.serie,
    deviceUnderMaintenced: location.state.detail.deviceUnderMaintenced || false,
    enabledForReserved: location.state.detail.enabledForReserved || false,
    available: location.state.detail.available || false,
  });

  const [docId, setDocId] = useState();

  const AddNewField = () => {
    let newValue = { id: "item-" + item.length, name: "", value: "" };
    setItem([...item, newValue]);
  };
  const RemoveField = (id) => {
    let items = item.filter((item) => item.id !== id);
    setItem(items);
  };
  const handleChangeName = (e, id) => {
    const { value } = e.target;
    let items = [...item];
    let itemFind = items.findIndex((it) => it.id === id);
    items[itemFind].name = value;
    setItem(items);
  };
  const handleChangeValue = (e, id) => {
    const { value } = e.target;
    let items = [...item];
    let itemFind = items.findIndex((it) => it.id === id);
    items[itemFind].value = value;
    setItem(items);
  };
  const onSubmit = async (data) => {
    let items = item.map((item) => ({
      name: item.name,
      value: item.value,
    }));
    let customData = data;
    customData.updatedAt = new Date();
    customData.customFields = items;
    await db
      .collection("assets")
      .doc(docId)
      .update(customData)
      .then(() => {
        history.push("/admin/assets");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const customFields = location.state.detail.customFields;

    let fields = customFields.map((field, index) => ({
      id: "item-" + index,
      name: field.name,
      value: field.value,
    }));
    setItem(fields);
    setDocId(location.state.detail.id);
  }, []);
  const saveButton = () => {
    return (
      <GridContainer justify="flex-end">
        <GridItem xs={6} sm={6} md={5}>
          <Button color="rose" type="submit">
            Guardar
          </Button>
        </GridItem>
        <GridItem xs={6} sm={6} md={4}>
          <Button
            color="rose"
            onClick={() => {
              history.push("/admin/assets");
            }}
          >
            Cancelar
          </Button>
        </GridItem>
      </GridContainer>
    );
  };
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
            <CustomTabs
              title=""
              headerColor="rose"
              footer
              componentFooter={saveButton()}
              tabs={[
                {
                  tabName: "Información basica",
                  tabIcon: ListAlt,
                  tabContent: (
                    <FormAsset
                      register={register}
                      errors={errors}
                      item={item}
                      AddNewField={AddNewField}
                      RemoveField={RemoveField}
                      handleChangeName={handleChangeName}
                      handleChangeValue={handleChangeValue}
                      handleInputChange={handleInputChange}
                      values={values}
                    />
                  ),
                },
                {
                  tabName: "Configuraciones",
                  tabIcon: SettingsApplications,
                  tabContent: (
                    <AssetsSettings
                      handleChangeChecked={handleChangeChecked}
                      values={values}
                    />
                  ),
                },
              ]}
            />
          </form>
        </GridItem>
      </GridContainer>
    </>
  );
}
