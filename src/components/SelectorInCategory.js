import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../screens/api/config';



// const SelectorInCategory = ({ isVisible, onClose, onApply, onReset }) => {
//     const [selectedCategories, setSelectedCategories] = useState({});
//     const [expandedCategories, setExpandedCategories] = useState({});
//     const [searchText, setSearchText] = useState('');
//     const [categoryAll, setCategoryAll] = useState([]);
    
//     useEffect(() => {
//         let apiUrl = `${BASE_URL}categories`;
//         axios.get(apiUrl)
//             .then(response => {
//                 const ctgData = response.data.data;
//                 setCategoryAll(ctgData);
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);

//     const filterCategories = (categories) => {
//         if (!searchText) return categories;

//         return categories.filter((category) => {
//             const matchesCategoryName = category.categoryName.toLowerCase().includes(searchText.toLowerCase());
//             const matchesChildren = category.categoryChildren && category.categoryChildren.some((child) =>
//                 child.categoryName.toLowerCase().includes(searchText.toLowerCase())
//             );

//             return matchesCategoryName || matchesChildren;
//         });
//     };
//     const handleApply = () => {
//         // Lấy danh sách ID của các danh mục đã chọn
//         const selectedCategoryIds = Object.keys(selectedCategories).filter(
//             (categoryId) => selectedCategories[categoryId] === true
//         );
//         if (selectedCategoryIds.length === 0) {
//             // Hiển thị thông báo nếu chưa có danh mục nào được chọn
//             Alert.alert("Thông báo", "Vui lòng chọn ít nhất một danh mục trước khi áp dụng.");
//             return; // Dừng lại nếu chưa có danh mục nào được chọn
//         }
//         // Lấy tên của các danh mục đã chọn dựa trên các ID đã chọn
//         const selectedCategoryNames = selectedCategoryIds.map((categoryId) => {
//             const category = categoryAll.find((cat) => cat.categoryId === categoryId);
//             return category.categoryName; // Không cần kiểm tra null vì API của bạn luôn trả về tên
//         });
    
//         // Truyền cả ID và tên danh mục vào hàm onApply
//         onApply(selectedCategoryIds, selectedCategoryNames); // Truyền cả ID và tên
//         onClose();
//     };
    
//     const toggleCategorySelection = (categoryId) => {
//         setSelectedCategories({
//             ...selectedCategories,
//             [categoryId]: !selectedCategories[categoryId],
//         });
//     };

//     const toggleExpand = (categoryId) => {
//         setExpandedCategories({
//             ...expandedCategories,
//             [categoryId]: !expandedCategories[categoryId],
//         });
//     };

//     const renderCategories = (categories, categoryLevel = 0) => {
//         return categories.map((category) => (
//             <View key={category.categoryId} style={{ paddingLeft: categoryLevel * 10 }}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                     {category.categoryChildren.length > 0 && (
//                         <TouchableOpacity onPress={() => toggleExpand(category.categoryId)} style={styles.expandButton}>
//                             <Text style={styles.expandText}>
//                                 {expandedCategories[category.categoryId] ? '▼' : '▶'}
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                     <TouchableOpacity
//                         style={styles.checkbox}
//                         onPress={() => toggleCategorySelection(category.categoryId)}
//                     >
//                         <Text style={styles.checkboxText}>
//                             {category.categoryName}
//                         </Text>
//                         {selectedCategories[category.categoryId] && (
//                             <View style={styles.checkedBox}>
//                                 <Text style={styles.tickCheckedBox}>✔</Text>
//                             </View>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{ marginLeft: '10%' }}>
//                     {expandedCategories[category.categoryId] &&
//                         category.categoryChildren.length > 0 &&
//                         renderCategories(category.categoryChildren, categoryLevel + 1)}
//                 </View>
//             </View>
//         ));
//     };

//     const handleReset = () => {
//         const selectedCategoryIds = null;
//         const selectedCategoryNames = null;

//         onReset(selectedCategoryIds, selectedCategoryNames);
//         onClose();
//     };

//     return (
//         <Modal
//             visible={isVisible}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={onClose}
//         >
//             <TouchableWithoutFeedback onPress={onClose}>
//                 <View style={styles.modalOverlay} />
//             </TouchableWithoutFeedback>

//             <View style={styles.container}>
//                 <Text style={styles.title}>Select Categories</Text>

//                 <TextInput
//                     style={styles.searchBar}
//                     placeholder="Search..."
//                     value={searchText}
//                     onChangeText={setSearchText}
//                 />

//                 <ScrollView style={styles.scrollView}>
//                     <Text style={styles.titleSmall}>Categories</Text>
//                     <View style={styles.checkboxContainer}>
//                         {renderCategories(filterCategories(categoryAll))}
//                     </View>
//                 </ScrollView>

//                 <View style={styles.buttonContainer}>
//                     <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
//                         <Text>Reset</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
//                         <Text style={styles.applyText}>Apply</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

const SelectorInCategory = ({ isVisible, onClose, onApply, onReset, categoriesProduct }) => {
    const [selectedCategories, setSelectedCategories] = useState({});
    const [expandedCategories, setExpandedCategories] = useState({});
    const [searchText, setSearchText] = useState('');
    const [categoryAll, setCategoryAll] = useState([]);

    useEffect(() => {
    let apiUrl = `${BASE_URL}categories`;
    axios.get(apiUrl)
        .then(response => {
            const ctgData = response.data.data;
            setCategoryAll(ctgData);

            // Kiểm tra và tự động chọn danh mục nếu `categoriesProduct` có dữ liệu
            if (categoriesProduct && categoriesProduct.length > 0) {
                const initialSelected = {};

                // Hàm đệ quy để chọn tất cả các danh mục cha và con dựa trên `categoriesProduct`
                const selectCategories = (categories) => {
                    categories.forEach(category => {
                        // Nếu `categoryId` có trong `categoriesProduct`, đánh dấu là đã chọn
                        if (categoriesProduct.includes(category.categoryId)) {
                            initialSelected[category.categoryId] = true;
                        }
                        // Tiếp tục duyệt qua các danh mục con
                        if (category.categoryChildren && category.categoryChildren.length > 0) {
                            selectCategories(category.categoryChildren);
                        }
                    });
         
                };

                selectCategories(ctgData);
                setSelectedCategories(initialSelected);
                
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}, [categoriesProduct]); // Lắng nghe sự thay đổi của `categoriesProduct`

    const filterCategories = (categories) => {
        if (!searchText) return categories;
        return categories.filter((category) => {
            const matchesCategoryName = category.categoryName.toLowerCase().includes(searchText.toLowerCase());
            const matchesChildren = category.categoryChildren && category.categoryChildren.some((child) =>
                child.categoryName.toLowerCase().includes(searchText.toLowerCase())
            );
            return matchesCategoryName || matchesChildren;
        });
    };

    const handleApply = () => {
        const selectedCategoryIds = Object.keys(selectedCategories).filter(
            (categoryId) => selectedCategories[categoryId] === true
        );
        if (selectedCategoryIds.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một danh mục trước khi áp dụng.");
            return;
        }
        const selectedCategoryNames = selectedCategoryIds.map((categoryId) => {
            const category = categoryAll.find((cat) => cat.categoryId === categoryId);
            return category.categoryName;
        });
        onApply(selectedCategoryIds, selectedCategoryNames);
        onClose();
    };

    const toggleCategorySelection = (categoryId) => {
        const newSelectedCategories = {
            ...selectedCategories,
            [categoryId]: !selectedCategories[categoryId],
        };
        
        setSelectedCategories(newSelectedCategories);
    
        // Lấy danh sách ID và tên các danh mục đã chọn
        const selectedCategoryIds = Object.keys(newSelectedCategories).filter(
            (id) => newSelectedCategories[id]
        );
    
        const selectedCategoryNames = selectedCategoryIds.map((id) => {
            const category = categoryAll.find((cat) => cat.categoryId === id);
            return category ? category.categoryName : null;
        }).filter(Boolean);
    
        // Truyền ID và tên danh mục vào `onApply` ngay lập tức
        onApply(selectedCategoryIds, selectedCategoryNames);
    };
    

    const renderCategories = (categories, categoryLevel = 0) => {
        return categories.map((category) => (
            <View key={category.categoryId} style={{ paddingLeft: categoryLevel * 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {category.categoryChildren.length > 0 && (
                        <TouchableOpacity onPress={() => toggleExpand(category.categoryId)} style={styles.expandButton}>
                            <Text style={styles.expandText}>
                                {expandedCategories[category.categoryId] ? '▼' : '▶'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => toggleCategorySelection(category.categoryId, categoryAll)}
                    >
                        <Text style={styles.checkboxText}>
                            {category.categoryName}
                        </Text>
                        {selectedCategories[category.categoryId] && (
                            <View style={styles.checkedBox}>
                                <Text style={styles.tickCheckedBox}>✔</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={{ marginLeft: '10%' }}>
                    {expandedCategories[category.categoryId] &&
                        category.categoryChildren.length > 0 &&
                        renderCategories(category.categoryChildren, categoryLevel + 1)}
                </View>
            </View>
        ));
    };

    const handleReset = () => {
        setSelectedCategories({});
        onReset(null, null);
        onClose();
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
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.titleSmall}>Categories</Text>
                    <View style={styles.checkboxContainer}>
                        {renderCategories(filterCategories(categoryAll))}
                    </View>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                        <Text>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
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
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 10,
    },
    applyButton: {
        width: 120,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
        backgroundColor: '#3669c9',
        borderRadius: 10,
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
