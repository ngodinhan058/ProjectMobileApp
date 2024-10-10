import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
} from 'react-native';

const categoryData = [
    {
        id: "482ce198-2473-4a2f-9296-1f67c1a7376b",
        level: 0,
        name: "Điện thoại",
        slug: "dien-thoai",
        release: "2024-07-12T15:00:00Z",
        createdAt: "2024-10-09T04:15:33.988+00:00",
        updatedAt: "2024-10-09T04:15:33.988+00:00",
        status: {
            id: "b24151e5-0400-4615-ac54-043e843a8812",
            type: 1,
            name: "Actice"
        },
        childrens: [
            {
                id: "2bff891d-04f2-4050-87a6-a65f5dfba4c8",
                level: 1,
                name: "Remote4",
                slug: "re-mote4",
                release: "2024-10-09T08:00:00Z",
                createdAt: "2024-10-09T05:34:01.047+00:00",
                updatedAt: "2024-10-09T05:34:01.047+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },
            {
                id: "5b07eb04-c9b9-4cf8-a494-249051d8f774",
                level: 1,
                name: "Di động",
                slug: "di-động",
                release: "2024-10-09T15:00:00Z",
                createdAt: "2024-10-09T04:50:06.928+00:00",
                updatedAt: "2024-10-09T04:50:06.928+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },
            {
                id: "8e2b0d38-0c23-4085-8347-cacaba17fd31",
                level: 1,
                name: "Ti Vi",
                slug: "ti-vi",
                release: "2024-01-09T15:00:00Z",
                createdAt: "2024-10-09T04:21:27.229+00:00",
                updatedAt: "2024-10-09T04:21:27.229+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },
            {
                id: "9ab777bc-72f6-4101-8b2d-8c8a7f1f7e9e",
                level: 1,
                name: "Tủ Lạnh",
                slug: "tu-lanh",
                release: "2024-01-09T15:00:00Z",
                createdAt: "2024-10-09T04:22:09.451+00:00",
                updatedAt: "2024-10-09T04:22:09.451+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },
            {
                id: "9b02df65-5c5d-4c37-ba20-ae94745842ca",
                level: 1,
                name: "Remote",
                slug: "re-mote",
                release: "2024-10-09T15:00:00Z",
                createdAt: "2024-10-09T05:05:46.709+00:00",
                updatedAt: "2024-10-09T05:05:46.709+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },


            {
                id: "eb9610ac-d458-4b27-848a-ab726587a3d0",
                level: 1,
                name: "Quạt Máy",
                slug: "quat-may",
                release: "2024-01-09T15:00:00Z",
                createdAt: "2024-10-09T04:44:46.695+00:00",
                updatedAt: "2024-10-09T04:44:46.695+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: []
            },
            {
                id: "ebd56fe5-eaea-49bb-a1c9-81894cdd8ea9",
                level: 1,
                name: "Máy Tính",
                slug: "may-tinh",
                release: "2024-12-09T15:00:00Z",
                createdAt: "2024-10-09T04:17:40.316+00:00",
                updatedAt: "2024-10-09T04:17:40.316+00:00",
                status: {
                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                    type: 1,
                    name: "Actice"
                },
                childrens: [
                    {
                        id: "1c3a008f-fb1d-4ded-a77f-074d14fcc572",
                        level: 2,
                        name: "Laptop",
                        slug: "lap-top",
                        release: "2024-10-09T15:00:00Z",
                        createdAt: "2024-10-09T04:48:55.703+00:00",
                        updatedAt: "2024-10-09T04:48:55.703+00:00",
                        status: {
                            id: "b24151e5-0400-4615-ac54-043e843a8812",
                            type: 1,
                            name: "Actice"
                        },
                        childrens: [
                            {
                                id: "5623cb4c-48fc-4c18-9f2e-5aac3c5d5c8a",
                                level: 3,
                                name: "Remote1",
                                slug: "re-mote1",
                                release: "0015-04-14T15:00:00Z",
                                createdAt: "2024-10-09T05:06:15.377+00:00",
                                updatedAt: "2024-10-09T05:06:15.377+00:00",
                                status: {
                                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                                    type: 1,
                                    name: "Actice"
                                },
                                childrens: [
                                    {
                                        id: "8b1385cd-6b8e-4c91-b15b-61e9ed94fa46",
                                        level: 4,
                                        name: "Remote1-1",
                                        slug: "re-mote1-1",
                                        release: "2024-10-09T15:00:00Z",
                                        createdAt: "2024-10-09T05:06:48.118+00:00",
                                        updatedAt: "2024-10-09T05:06:48.118+00:00",
                                        status: {
                                            id: "b24151e5-0400-4615-ac54-043e843a8812",
                                            type: 1,
                                            name: "Actice"
                                        },
                                        childrens: []
                                    }
                                ]
                            },
                            {
                                id: "1c3a008f-fb1d-4ded-a77f-074d14fcc572",
                                level: 3,
                                name: "Laptop2",
                                slug: "laptop-2",
                                release: "2024-10-09T15:00:00Z",
                                createdAt: "2024-10-09T05:05:46.709+00:00",
                                updatedAt: "2024-10-09T05:05:46.709+00:00",
                                status: {
                                    id: "b24151e5-0400-4615-ac54-043e843a8812",
                                    type: 1,
                                    name: "Actice"
                                },
                                childrens: []
                            }
                        ]
                    }
                ]
            }
        ]
    }
];


const SelectorInCategory = ({ isVisible, onClose, onApply, onReset }) => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchText, setSearchText] = useState('');

    // Filter categories based on search text
    // Filter categories based on search text
    const filterCategories = (categories) => {
        if (!searchText) return categories;

        return categories.filter((category) => {
            // Kiểm tra tên của danh mục chính
            const matchesCategoryName = category.name.toLowerCase().includes(searchText.toLowerCase());

            // Kiểm tra tên trong danh mục con
            const matchesChildrens = category.childrens && category.childrens.some((child) =>
                child.name.toLowerCase().includes(searchText.toLowerCase())
            );

            // Trả về true nếu danh mục chính hoặc danh mục con khớp với searchText
            return matchesCategoryName || matchesChildrens;
        });
    };


    // Toggle category selection
    const toggleCategorySelection = (categoryName) => {
        setSelectedCategories({
            ...selectedCategories,
            [categoryName]: !selectedCategories[categoryName],
        });
    };

    // Toggle visibility of children
    const toggleExpand = (categoryName) => {
        setExpandedCategories({
            ...expandedCategories,
            [categoryName]: !expandedCategories[categoryName],
        });
    };

    // Recursive function to render categories and children
    const renderCategories = (categories, level = 0) => {
        return categories.map((category) => (
            <View key={category.name} style={{ paddingLeft: level * 5 }}>
                <View style={{ flexDirection: 'row' }} >
                    {/* Expand/Collapse button if there are children */}
                    {category.childrens.length > 0 && (
                        <TouchableOpacity onPress={() => toggleExpand(category.name)} style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Text style={styles.expandText}>
                                {expandedCategories[category.name] ? '▼' : '▶'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleCategorySelection(category.name)}
                    >
                        <Text style={styles.checkboxText}>
                            {category.name}
                        </Text>
                        {selectedCategories[category.name] && (
                            <View style={styles.checkedBox}>
                                <Text style={styles.tickCheckedBox}>✔</Text>
                            </View>
                        )}
                    </TouchableOpacity>


                </View>

                <View style={{ marginLeft: '15%' }} >
                    {/* Render children if expanded */}
                    {expandedCategories[category.name] &&
                        category.childrens.length > 0 &&
                        renderCategories(category.childrens, level + 1)}
                </View>
            </View>
        ));
    };

    const handleReset = () => {
        setSelectedCategories({});
        setExpandedCategories({});
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.container}>
                <Text style={styles.title}>Select Categories</Text>

                {/* Search bar */}
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <ScrollView style={styles.scrollView}>
                    <Text style={styles.titleSmall}>Categories</Text>
                    <View style={styles.checkboxContainer}>
                        {/* Render parent and child categories */}
                        {renderCategories(filterCategories(categoryData))}
                    </View>

                    <View style={styles.line}></View>


                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={() => alert('Applied')}>
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        position: 'absolute',
        width: '100%',
        padding: 20,
        backgroundColor: '#FFF',
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        bottom: 0,
    },
    scrollView: {
        height: '20%',
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ededed',
        marginVertical: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    titleSmall: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    searchBar: {
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    resetButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    applyButton: {
        padding: 10,
        backgroundColor: '#0066ff',
        borderRadius: 5,
    },
    applyText: {
        color: 'white',
    },
    checkboxContainer: {
        marginBottom: 20,
    },
    checkbox: {
        width: 100,
        height: 50,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginVertical: 5,
    },
    centeredCheckbox: {
        alignItems: 'center', // Căn giữa cho danh mục cha
    },
    checkboxText: {
        position: 'absolute',
        fontSize: 16,
    },
    checkedBox: {
        width: 100,
        height: 50,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: '#3669c9',
        // justifyContent: 'space-between'
    },
    tickCheckedBox: {
        position: 'absolute',
        width: 12,
        height: 12,
        backgroundColor: '#3669c9',
        borderRadius: 15,
        textAlign: 'center',
        color: '#fff',
        right: 3,
        top: 2,
        fontSize: 7,
    },
    expandText: {
        width: 25,
        height: 25,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 25,
        fontSize: 16,
        textAlign: 'center',
        marginRight: 5
    },
});


export default SelectorInCategory;
