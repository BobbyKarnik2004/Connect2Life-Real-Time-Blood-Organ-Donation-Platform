import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Droplets, HeartPulse, Calendar, Clock, Map, Phone, Mail, User } from 'lucide-react';

// Simple Button component
const Button = ({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  [key: string]: any;
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card component
const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simple Tabs component with defaultValue support
interface TabsProps {
  children: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ 
  children, 
  value: propValue,
  defaultValue = '',
  onValueChange, 
  className = '' 
}, ref) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  const currentValue = propValue !== undefined ? propValue : activeTab;

  const handleValueChange = (newValue: string) => {
    if (propValue === undefined) {
      setActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  // Find the first tab's value if no value is set
  React.useEffect(() => {
    if (propValue === undefined && activeTab === '' && React.Children.count(children) > 0) {
      // Find the first TabsTrigger with a value
      const findFirstTabValue = (nodes: React.ReactNode): string | undefined => {
        let result: string | undefined;
        React.Children.forEach(nodes, (node) => {
          if (result) return;
          
          if (React.isValidElement(node)) {
            if (node.type === TabsTrigger && node.props.value) {
              result = node.props.value;
            } else if (node.props && node.props.children) {
              result = findFirstTabValue(node.props.children);
            }
          }
        });
        return result;
      };

      const firstTabValue = findFirstTabValue(children);
      if (firstTabValue && activeTab === '') {
        setActiveTab(firstTabValue);
      }
    }
  }, [children, activeTab, propValue]);

  // Update the active tab when defaultValue changes
  React.useEffect(() => {
    if (defaultValue && propValue === undefined) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue, propValue]);

  // Clone children and inject necessary props
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === TabsList) {
      return (
        <TabsList 
          value={currentValue} 
          onValueChange={handleValueChange}
          className={child.props.className}
        >
          {child.props.children}
        </TabsList>
      );
    }

    if (child.type === TabsContent) {
      return (
        <TabsContent
          key={child.props.value}
          value={child.props.value}
          active={child.props.value === currentValue}
          className={child.props.className}
        >
          {child.props.children}
        </TabsContent>
      );
    }

    return child;
  });

  return (
    <div className={className} ref={ref}>
      {enhancedChildren}
    </div>
  );
});

Tabs.displayName = 'Tabs';

interface TabsListProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ 
  children, 
  value,
  onValueChange,
  className = '' 
}, ref) => {
  // Create a new onClick handler for each TabsTrigger
  const handleTriggerClick = (childValue: string, originalOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void) => 
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onValueChange) {
        onValueChange(childValue);
      }
      if (originalOnClick) {
        originalOnClick(e);
      }
    };

  return (
    <div 
      ref={ref}
      role="tablist"
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          const isActive = child.props.value === value;
          return (
            <TabsTrigger
              key={child.props.value}
              value={child.props.value}
              onClick={handleTriggerClick(child.props.value, child.props.onClick)}
              data-state={isActive ? 'active' : 'inactive'}
              aria-selected={isActive}
              className={child.props.className}
            >
              {child.props.children}
            </TabsTrigger>
          );
        }
        return child;
      })}
    </div>
  );
});

TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  value: string;
  'data-state'?: 'active' | 'inactive';
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ 
  children, 
  value, 
  className = '',
  onClick,
  'data-state': dataState,
  ...props 
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const isActive = dataState === 'active';
  
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={handleClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? 'bg-background text-foreground shadow-sm' 
          : 'text-muted-foreground hover:text-foreground'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  active?: boolean;
  className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ 
  children, 
  value, 
  active,
  className = '' 
}, ref) => {
  if (active === false) return null;
  
  return (
    <div 
      ref={ref}
      role="tabpanel"
      tabIndex={0}
      className={`mt-2 ${className}`}
    >
      {children}
    </div>
  );
});

TabsContent.displayName = 'TabsContent';

// Simple Badge component
const Badge = ({ 
  children, 
  variant = 'default',
  className = '' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {children}
    </span>
  );
};

// Simple Input component
const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Simple Label component
const Label = ({ htmlFor, children, className = '' }: { 
  htmlFor?: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <label 
    htmlFor={htmlFor} 
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

// Simple Select component
const Select = ({ children, value, onValueChange, className = '' }: { 
  children: React.ReactNode; 
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) => (
  <select 
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

const SelectTrigger = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span>{placeholder}</span>
);

const SelectContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${className}`}>
    {children}
  </div>
);

const SelectItem = ({ children, value, className = '' }: { 
  children: React.ReactNode; 
  value: string;
  className?: string;
}) => (
  <option value={value} className={className}>
    {children}
  </option>
);

// Simple Slider component
const Slider = ({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1,
  className = '' 
}: { 
  value: number[]; 
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) => (
  <div className={`relative flex w-full items-center ${className}`}>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary"
    />
  </div>
);

// Simple toast hook
const useToast = () => {
  const showToast = (options: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
    console.log(`[Toast] ${options.title}: ${options.description || ''}`);
  };
  
  return { toast: showToast };
};

// Create a simple avatar component since we're having issues with the shadcn one
const Avatar = ({ 
  className = '',
  src,
  alt,
  fallback,
  children 
}: { 
  className?: string;
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback}
        </div>
      )}
      {children}
    </div>
  );
};

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  lastDonation: string;
  location: string;
  distance: number;
  availability: string[];
  contact: {
    phone: string;
    email: string;
  };
  avatar?: string;
};

type Recipient = {
  id: string;
  name: string;
  bloodGroup: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  distance: number;
  requiredBy: string;
  contact: {
    phone: string;
    email: string;
  };
  avatar?: string;
};

const MatchingPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('donors');
  const [isLoading, setIsLoading] = useState(true);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  
  // Filter states
  const [bloodGroup, setBloodGroup] = useState('');
  const [distance, setDistance] = useState(50);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDonors: Donor[] = [
          {
            id: '1',
            name: 'John Doe',
            bloodGroup: 'A+',
            lastDonation: '2023-05-15',
            location: 'Downtown, New York',
            distance: 2.5,
            availability: ['Mon', 'Wed', 'Fri'],
            contact: {
              phone: '+1 (555) 123-4567',
              email: 'john.doe@example.com'
            },
            avatar: 'https://ui-avatars.com/api/?name=John+Doe'
          },
          {
            id: '2',
            name: 'Jane Smith',
            bloodGroup: 'O-',
            lastDonation: '2023-06-20',
            location: 'Brooklyn, New York',
            distance: 5.8,
            availability: ['Tue', 'Thu', 'Sat'],
            contact: {
              phone: '+1 (555) 987-6543',
              email: 'jane.smith@example.com'
            },
            avatar: 'https://ui-avatars.com/api/?name=Jane+Smith'
          },
          // Add more mock donors as needed
        ];
        
        const mockRecipients: Recipient[] = [
          {
            id: '1',
            name: 'Robert Johnson',
            bloodGroup: 'B+',
            urgency: 'high',
            location: 'Manhattan, New York',
            distance: 3.2,
            requiredBy: '2023-07-15',
            contact: {
              phone: '+1 (555) 555-1234',
              email: 'robert.j@example.com'
            },
            avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson'
          },
          {
            id: '2',
            name: 'Sarah Williams',
            bloodGroup: 'AB-',
            urgency: 'critical',
            location: 'Queens, New York',
            distance: 8.1,
            requiredBy: '2023-07-10',
            contact: {
              phone: '+1 (555) 222-3333',
              email: 'sarah.w@example.com'
            },
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams'
          },
          // Add more mock recipients as needed
        ];
        
        setDonors(mockDonors);
        setRecipients(mockRecipients);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);
  
  const handleConnect = (type: 'donor' | 'recipient', id: string) => {
    // In a real app, this would initiate a connection request
    toast({
      title: 'Connection Request Sent',
      description: `Your request has been sent to the ${type}.`,
    });
  };
  
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low Urgency</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium Urgency</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High Urgency</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Critical</Badge>;
      default:
        return null;
    }
  };
  
  const filteredDonors = donors.filter(donor => {
    const matchesBloodGroup = bloodGroup ? donor.bloodGroup === bloodGroup : true;
    const matchesDistance = donor.distance <= distance;
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         donor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesBloodGroup && matchesDistance && matchesSearch;
  });
  
  const filteredRecipients = recipients.filter(recipient => {
    const matchesBloodGroup = bloodGroup ? recipient.bloodGroup === bloodGroup : true;
    const matchesDistance = recipient.distance <= distance;
    const matchesSearch = recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         recipient.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesBloodGroup && matchesDistance && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {activeTab === 'donors' ? 'Find Donors' : 'Find Recipients'}
          </h1>
          <p className="text-muted-foreground">
            {activeTab === 'donors' 
              ? 'Connect with blood donors in your area' 
              : 'Connect with recipients who need blood donations'}
          </p>
        </div>
        
        <Tabs 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList>
              <TabsTrigger value="donors">
                <Droplets className="mr-2 h-4 w-4" />
                Find Donors
              </TabsTrigger>
              <TabsTrigger value="recipients">
                <HeartPulse className="mr-2 h-4 w-4" />
                Find Recipients
              </TabsTrigger>
            </TabsList>
            
            <div className="w-full md:w-auto flex-1 md:max-w-md">
              <Input
                placeholder={`Search ${activeTab} by name or location...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="blood-group">Blood Group</Label>
                    <Select 
                      value={bloodGroup}
                      onValueChange={setBloodGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Blood Groups" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Blood Groups</SelectItem>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Distance: {distance} km</Label>
                    </div>
                    <Slider
                      value={[distance]}
                      onValueChange={(value) => setDistance(value[0])}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>1 km</span>
                      <span>100 km</span>
                    </div>
                  </div>
                  
                  {activeTab === 'donors' && (
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                          <Button 
                            key={day} 
                            variant="outline" 
                            className="h-8 p-0 text-xs"
                            size="sm"
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full" variant="outline">
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're in urgent need of blood or have any questions, please contact our support team.
                  </p>
                  <Button className="w-full">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Results */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : activeTab === 'donors' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {filteredDonors.length} {filteredDonors.length === 1 ? 'Donor' : 'Donors'} Found
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <Select value="distance" onValueChange={() => {}}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Distance (Nearest)</SelectItem>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="blood-group">Blood Group</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {filteredDonors.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Droplets className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No donors found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setBloodGroup('');
                            setDistance(50);
                            setSearchQuery('');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredDonors.map((donor) => (
                        <Card key={donor.id} className="overflow-hidden">
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold">{donor.name}</h3>
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                                    {donor.bloodGroup}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                                  {donor.location} • {donor.distance.toFixed(1)} km away
                                </p>
                              </div>
                              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {donor.avatar ? (
                                  <img 
                                    src={donor.avatar} 
                                    alt={donor.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                                    {donor.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Available: {donor.availability.join(', ')}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <a href={`tel:${donor.contact.phone}`} className="hover:underline">
                                  {donor.contact.phone}
                                </a>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex space-x-2">
                              <Button 
                                variant="default" 
                                className="flex-1"
                                onClick={() => handleConnect('donor', donor.id)}
                              >
                                Request Donation
                              </Button>
                              <Button variant="outline" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">
                      {filteredRecipients.length} {filteredRecipients.length === 1 ? 'Recipient' : 'Recipients'} Found
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <Select value="urgency" onValueChange={() => {}}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgency">Urgency</SelectItem>
                          <SelectItem value="distance">Distance (Nearest)</SelectItem>
                          <SelectItem value="date">Required By</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {filteredRecipients.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <HeartPulse className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-2 text-lg font-medium">No recipients found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Try adjusting your search or filter criteria
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => {
                            setBloodGroup('');
                            setDistance(50);
                            setSearchQuery('');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredRecipients.map((recipient) => (
                        <Card key={recipient.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold">{recipient.name}</h3>
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                                    {recipient.bloodGroup}
                                  </Badge>
                                  {getUrgencyBadge(recipient.urgency)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  <MapPin className="inline h-3.5 w-3.5 mr-1" />
                                  {recipient.location} • {recipient.distance.toFixed(1)} km away
                                </p>
                              </div>
                              <Avatar 
                                className="h-12 w-12"
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}`}
                                fallback={recipient.name.charAt(0)}
                              />
                            </div>
                            
                            <div className="mt-4 space-y-3">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Required by: {new Date(recipient.requiredBy).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>Contact: {recipient.name || 'N/A'}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                <a href={`tel:${recipient.contact.phone}`} className="hover:underline">
                                  {recipient.contact.phone}
                                </a>
                              </div>
                            </div>
                            
                            <div className="mt-6 flex space-x-2">
                              <Button 
                                variant="default" 
                                className="flex-1"
                                onClick={() => handleConnect('recipient', recipient.id)}
                              >
                                Donate Now
                              </Button>
                              <Button variant="outline" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default MatchingPage;
